-- ==============================================================================
-- ÉVANN_STORIES DATABASE MIGRATION: ADD COUNTRY TO REVIEWS
-- Safe, non-destructive migration to support ISO-3166-1 country selection
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Add country_code and country_name columns safely to reviews table if they do not exist
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS country_code VARCHAR(2);

ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS country_name TEXT;

-- 2. Add index for country-based filtering
CREATE INDEX IF NOT EXISTS idx_reviews_country_code ON public.reviews(country_code);

-- 3. Drop existing view first so PostgreSQL allows adding new columns without ordinal conflict
DROP VIEW IF EXISTS public.public_approved_reviews;

-- 4. Recreate the public_approved_reviews view with country columns
-- Excludes private codm_uid_private and non-approved rows from public queries
CREATE VIEW public.public_approved_reviews AS
SELECT
    id,
    customer_name,
    country_code,
    country_name,
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

-- 5. Re-grant public view access permissions
GRANT SELECT ON public.public_approved_reviews TO anon, authenticated;

-- Comment for schema documentation
COMMENT ON COLUMN public.reviews.country_code IS 'ISO 3166-1 alpha-2 country code of the customer';
COMMENT ON COLUMN public.reviews.country_name IS 'Full standard display name of the customer country';
