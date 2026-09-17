-- ================================================================
-- MIGRATION: 2026091502_dish_videos.sql
-- Adds video metadata columns to the dishes table for the
-- video-first menu experience (Cloudinary video integration).
-- ================================================================

-- Add video metadata columns (idempotent via IF NOT EXISTS pattern)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'dishes' AND column_name = 'video_public_id'
  ) THEN
    ALTER TABLE public.dishes ADD COLUMN video_public_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'dishes' AND column_name = 'video_poster_url'
  ) THEN
    ALTER TABLE public.dishes ADD COLUMN video_poster_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'dishes' AND column_name = 'video_duration'
  ) THEN
    ALTER TABLE public.dishes ADD COLUMN video_duration NUMERIC(6, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'dishes' AND column_name = 'video_status'
  ) THEN
    ALTER TABLE public.dishes ADD COLUMN video_status TEXT DEFAULT 'READY';
  END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN public.dishes.video_public_id IS 'Cloudinary public ID for the dish video asset';
COMMENT ON COLUMN public.dishes.video_poster_url IS 'Custom poster frame URL for the dish video (overrides auto-generated poster)';
COMMENT ON COLUMN public.dishes.video_duration IS 'Duration of the video in seconds';
COMMENT ON COLUMN public.dishes.video_status IS 'Video processing status: PROCESSING, READY, ERROR';
