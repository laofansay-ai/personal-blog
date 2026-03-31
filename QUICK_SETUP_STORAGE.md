# Quick Setup Guide - Supabase Storage

## How to Run the SQL Script

### Option 1: Via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `zbziqvakppmopcgiypxg`

2. **Open SQL Editor**
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Copy and Run the Script**
   - Open the file: `supabase/setup_storage.sql`
   - Copy ALL the content
   - Paste into the SQL Editor
   - Click **Run** (or press Ctrl+Enter / Cmd+Enter)

4. **Verify Success**
   - You should see "Success. No rows returned"
   - Go to **Storage** section
   - You should see a `posters` bucket with 🔓 icon (public)

### Option 2: Using Supabase CLI (Requires Service Role Key)

If you have the service role key, you can run it via CLI:

```bash
# Get your service role key from .env.local
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Run the migration
psql $SUPABASE_DB_URL -f supabase/setup_storage.sql
```

## After Running the Script

### Test the Upload

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Login to admin panel:
   - Go to: http://localhost:3000/login
   - Login or register an account

3. Create/Edit a post:
   - Go to: http://localhost:3000/admin/posts
   - Click "创建文章" or edit existing post
   - Scroll to "海报图片" section
   - Click "上传海报图片"
   - Select an image file
   - Upload should work! ✅

## Troubleshooting

### Error: "must be owner of table objects"
- You need to use the **service_role** key instead of anon key
- In SQL Editor, click your profile icon → select "Use service_role key"

### Error: "Bucket not found"
- The bucket wasn't created successfully
- Re-run the SQL script
- Verify in Storage section that `posters` bucket exists

### Upload fails with permission error
- Check that all 4 policies were created
- Verify user is authenticated (logged in)
- Check RLS policies in bucket settings

## Files Reference

- 📄 [`supabase/setup_storage.sql`](supabase/setup_storage.sql) - Main SQL script
- 📄 [`lib/SupabaseUpload.tsx`](lib/SupabaseUpload.tsx) - Upload component
- 📄 [`app/admin/posts/page.tsx`](app/admin/posts/page.tsx) - Admin posts page using upload

## What This Script Does

1. ✅ Creates `posters` storage bucket (public)
2. ✅ Enables Row Level Security
3. ✅ Allows public read access (view images)
4. ✅ Allows authenticated users to upload
5. ✅ Allows authenticated users to update/delete their uploads

---

**Need Help?** Check the detailed guide: [SUPABASE_STORAGE_SETUP.md](SUPABASE_STORAGE_SETUP.md)
