-- ==============================================================================
-- ÉVANN OPS: SURVIVAL RUN — DATABASE MIGRATION
-- Table Schema, RLS Policies, Atomic Score Function & Indexes
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create table for shared survival run records
CREATE TABLE IF NOT EXISTS public.survival_run_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_name TEXT NOT NULL DEFAULT 'GHOST_OPERATOR' CHECK (char_length(player_name) >= 2 AND char_length(player_name) <= 30),
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10000000),
    distance_m NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (distance_m >= 0),
    mission_level INTEGER NOT NULL DEFAULT 1 CHECK (mission_level >= 1 AND mission_level <= 99),
    client_platform TEXT DEFAULT 'web' CHECK (char_length(client_platform) <= 20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes for fast leaderboard and high score lookup
CREATE INDEX IF NOT EXISTS idx_survival_records_score_desc ON public.survival_run_records(score DESC);
CREATE INDEX IF NOT EXISTS idx_survival_records_created ON public.survival_run_records(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.survival_run_records ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Anyone (authenticated or anonymous public visitor) can view high scores
DROP POLICY IF EXISTS "Public can view survival records" ON public.survival_run_records;
CREATE POLICY "Public can view survival records"
    ON public.survival_run_records
    FOR SELECT
    USING (true);

-- 5. Policy: Public visitors can insert their game scores
DROP POLICY IF EXISTS "Public can submit survival scores" ON public.survival_run_records;
CREATE POLICY "Public can submit survival scores"
    ON public.survival_run_records
    FOR INSERT
    WITH CHECK (
        score > 0 AND
        score <= 10000000 AND
        char_length(player_name) >= 2
    );

-- 6. Atomic function to submit score and determine if it set a new global record
CREATE OR REPLACE FUNCTION public.submit_survival_score(
    p_player_name TEXT,
    p_score INTEGER,
    p_distance_m NUMERIC,
    p_mission_level INTEGER,
    p_platform TEXT DEFAULT 'web'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_max INTEGER := 0;
    v_is_new_record BOOLEAN := FALSE;
    v_clean_name TEXT;
    v_inserted_id UUID;
BEGIN
    -- Sanitize player name
    v_clean_name := trim(p_player_name);
    IF char_length(v_clean_name) < 2 OR char_length(v_clean_name) > 30 THEN
        v_clean_name := 'GHOST_OPERATOR';
    END IF;

    -- Validate score sanity
    IF p_score <= 0 OR p_score > 10000000 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid score range',
            'is_new_record', false
        );
    END IF;

    -- Query current all-time top score
    SELECT COALESCE(MAX(score), 0) INTO v_current_max FROM public.survival_run_records;

    -- Check if beaten
    IF p_score > v_current_max THEN
        v_is_new_record := TRUE;
    END IF;

    -- Insert the record
    INSERT INTO public.survival_run_records (
        player_name,
        score,
        distance_m,
        mission_level,
        client_platform
    ) VALUES (
        v_clean_name,
        p_score,
        GREATEST(0, p_distance_m),
        GREATEST(1, p_mission_level),
        p_platform
    ) RETURNING id INTO v_inserted_id;

    RETURN jsonb_build_object(
        'success', true,
        'id', v_inserted_id,
        'is_new_record', v_is_new_record,
        'global_high_score', GREATEST(v_current_max, p_score),
        'submitted_score', p_score
    );
END;
$$;

-- 7. Grant public permissions to execute the atomic function
GRANT EXECUTE ON FUNCTION public.submit_survival_score(TEXT, INTEGER, NUMERIC, INTEGER, TEXT) TO anon, authenticated;
