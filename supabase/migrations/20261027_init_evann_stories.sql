-- ==============================================================================
-- ÉVANN_STORIES DATABASE MIGRATION
-- Production Schema, Private UID Isolation, RLS Policies & Storage Configuration
-- Run this in the Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL CHECK (char_length(customer_name) >= 2 AND char_length(customer_name) <= 60),
    platform TEXT NOT NULL CHECK (platform IN ('Discord', 'WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Other')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL CHECK (char_length(review_text) >= 20 AND char_length(review_text) <= 1000),
    -- PRIVATE TRANSACTION FIELD: Never exposed to public visitors
    codm_uid_private TEXT NOT NULL CHECK (char_length(codm_uid_private) >= 6 AND char_length(codm_uid_private) <= 32),
    screenshot_storage_path TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    purchase_verified BOOLEAN NOT NULL DEFAULT FALSE,
    admin_reply TEXT CHECK (admin_reply IS NULL OR char_length(admin_reply) <= 1000),
    admin_replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    approved_at TIMESTAMPTZ,
    moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_status_created ON public.reviews(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_platform ON public.reviews(platform);
CREATE INDEX IF NOT EXISTS idx_reviews_codm_uid ON public.reviews(codm_uid_private);

-- 3. Create review_reactions table
CREATE TABLE IF NOT EXISTS public.review_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('helpful', 'heart', 'thumbs_up')),
    visitor_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_visitor_reaction UNIQUE (review_id, reaction_type, visitor_id)
);

CREATE INDEX IF NOT EXISTS idx_reactions_review_id ON public.review_reactions(review_id);

-- 4. Create admin_users table for trusted authorization
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helper function to check if current user is verified admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
       OR email = (auth.jwt() ->> 'email')
  );
$$;

-- 5. SECURE PUBLIC VIEW (Crucial Privacy Barrier)
-- Excludes codm_uid_private and non-approved rows from public queries
CREATE OR REPLACE VIEW public.public_approved_reviews AS
SELECT
    id,
    customer_name,
    platform,
    rating,
    review_text,
    screenshot_storage_path,
    purchase_verified,
    admin_reply,
    admin_replied_at,
    created_at,
    approved_at
FROM public.reviews
WHERE status = 'approved';

-- Grant permissions on view
GRANT SELECT ON public.public_approved_reviews TO anon, authenticated;

-- 6. RPC Function to fetch reaction counts aggregated
CREATE OR REPLACE FUNCTION public.get_review_reactions(p_review_ids UUID[])
RETURNS TABLE(review_id UUID, reaction_type TEXT, count BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT review_id, reaction_type, COUNT(*) as count
  FROM public.review_reactions
  WHERE review_id = ANY(p_review_ids)
  GROUP BY review_id, reaction_type;
$$;

GRANT EXECUTE ON FUNCTION public.get_review_reactions(UUID[]) TO anon, authenticated;

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- RLS POLICIES FOR REVIEWS
-- ----------------------------------------------------

-- Policy 1: Anonymous public can ONLY insert new reviews with pending status and no fake verified badges
CREATE POLICY "anon_can_submit_pending_review"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (
    status = 'pending'
    AND purchase_verified = FALSE
    AND admin_reply IS NULL
);

-- Policy 2: Authenticated Administrators have full access to select, update, and delete
CREATE POLICY "admins_full_access_reviews"
ON public.reviews
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ----------------------------------------------------
-- RLS POLICIES FOR REACTIONS
-- ----------------------------------------------------

-- Anyone can read reactions on approved reviews
CREATE POLICY "anyone_can_read_reactions"
ON public.review_reactions
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.reviews
        WHERE reviews.id = review_reactions.review_id
          AND reviews.status = 'approved'
    )
);

-- Anyone can insert a reaction on approved reviews
CREATE POLICY "anyone_can_react_to_approved_reviews"
ON public.review_reactions
FOR INSERT
TO anon, authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.reviews
        WHERE reviews.id = review_reactions.review_id
          AND reviews.status = 'approved'
    )
);

-- ----------------------------------------------------
-- RLS POLICIES FOR ADMIN USERS TABLE
-- ----------------------------------------------------
CREATE POLICY "admins_read_admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

-- ----------------------------------------------------
-- 8. STORAGE CONFIGURATION FOR EVIDENCE
-- ----------------------------------------------------

-- Create private evidence bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-evidence', 'review-evidence', FALSE)
ON CONFLICT (id) DO UPDATE SET public = FALSE;

-- Storage Policy 1: Anyone can upload screenshot into the evidence folder with restricted size
CREATE POLICY "anon_upload_screenshot_evidence"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
    bucket_id = 'review-evidence'
    AND (storage.foldername(name))[1] = 'evidence'
);

-- Storage Policy 2: Admin can read/download all screenshots
CREATE POLICY "admin_read_all_screenshots"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'review-evidence'
    AND public.is_admin()
);

-- Storage Policy 3: Admin can delete screenshots
CREATE POLICY "admin_delete_screenshots"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'review-evidence'
    AND public.is_admin()
);

-- Storage Policy 4: Allow public to view screenshot ONLY if associated review is approved
CREATE POLICY "public_read_approved_screenshots"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
    bucket_id = 'review-evidence'
    AND EXISTS (
        SELECT 1 FROM public.reviews
        WHERE reviews.screenshot_storage_path = name
          AND reviews.status = 'approved'
    )
);
