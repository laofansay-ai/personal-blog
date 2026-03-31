-- ============================================
-- Supabase Storage Setup for Posters Bucket
-- Run this in Supabase SQL Editor with service_role key
-- ============================================

-- Step 1: Create the storage bucket if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('posters', 'posters', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Step 2: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Step 3: Create policy for public read access (anyone can view images)
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'posters');

-- Step 4: Create policy for authenticated uploads (only logged-in users can upload)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'posters'
);

-- Step 5: Create policy for authenticated updates
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'posters'
);

-- Step 6: Create policy for authenticated deletes
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'posters'
);

-- ============================================
-- Verification Queries (Optional - uncomment to verify)
-- ============================================

-- Check if bucket was created
-- SELECT * FROM storage.buckets WHERE id = 'posters';

-- Check policies
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%posters%';

-- ============================================
-- Setup Complete!
-- You should now be able to upload images to the posters bucket.
-- ============================================
