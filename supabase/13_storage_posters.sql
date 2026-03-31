-- Create storage bucket for posters
INSERT INTO storage.buckets (id, name, public) 
VALUES ('posters', 'posters', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to posters bucket
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'posters');

-- Allow authenticated users to upload to posters bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'posters' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own uploads
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'posters' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'posters' 
    AND auth.role() = 'authenticated'
);
