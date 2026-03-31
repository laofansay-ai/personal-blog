# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage for image uploads.

## Prerequisites

- Supabase project (https://supabase.com)
- Admin access to your Supabase project

## Step 1: Run the Storage Migration

Execute the SQL file in your Supabase project:

```bash
# Using Supabase CLI
supabase db push

# Or manually execute: supabase/13_storage_posters.sql
```

This will:
- Create a `posters` storage bucket
- Set up Row Level Security (RLS) policies
- Configure public read access
- Allow authenticated users to upload, update, and delete images

## Step 2: Verify Bucket Creation

1. Go to your Supabase Dashboard
2. Navigate to **Storage** section
3. You should see a `posters` bucket
4. Ensure it's set to **Public** mode

## Step 3: Configure RLS Policies (if not applied automatically)

In Supabase Dashboard → Storage → posters bucket → Policies, ensure these policies exist:

### Public Read Access
```sql
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'posters');
```

### Authenticated Upload
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'posters' 
    AND auth.role() = 'authenticated'
);
```

### Authenticated Update
```sql
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'posters' 
    AND auth.role() = 'authenticated'
);
```

### Authenticated Delete
```sql
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'posters' 
    AND auth.role() = 'authenticated'
);
```

## Step 4: Update Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 5: Test Upload

1. Start your development server: `npm run dev`
2. Login to admin panel at `/login`
3. Create or edit a post
4. Use the "上传海报图片" button to upload an image
5. The image should be stored in Supabase Storage and the URL added to the post

## File Structure

Images will be stored in the following structure:
```
posters/
└── blog_posters/
    ├── 1711900000000-abc123.jpg
    └── 1711900000001-def456.png
```

## Public URL Format

The uploaded images will have URLs like:
```
https://zbziqvakppmopcgiypxg.supabase.co/storage/v1/object/public/posters/blog_posters/filename.jpg
```

## Troubleshooting

### "Bucket not found" error
- Ensure the migration was executed successfully
- Check if the bucket exists in Supabase Dashboard → Storage

### "Permission denied" error
- Verify RLS policies are correctly set up
- Ensure user is authenticated when uploading

### Images not loading
- Check if bucket is set to public
- Verify the URL format is correct
- Check browser console for CORS errors

## Migration from Cloudinary

If you're migrating from Cloudinary:

1. Download all images from Cloudinary
2. Upload them to Supabase Storage manually or via script
3. Update database records with new URLs
4. Update upload component to use SupabaseUpload instead of CloudinaryUpload

## Security Notes

- All uploads require authentication
- Only authenticated users can manage images
- Public can only read (view) images
- Service role key should be kept secret and only used server-side
