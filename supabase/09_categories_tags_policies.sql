-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Categories Policies
-- Everyone can read categories
CREATE POLICY "Categories are viewable by everyone" 
ON categories FOR SELECT 
USING (true);

-- Only admin can insert/update/delete categories
CREATE POLICY "Admins can insert categories" 
ON categories FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update categories" 
ON categories FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete categories" 
ON categories FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Tags Policies
-- Everyone can read tags
CREATE POLICY "Tags are viewable by everyone" 
ON tags FOR SELECT 
USING (true);

-- Only admin can insert/update/delete tags
CREATE POLICY "Admins can insert tags" 
ON tags FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update tags" 
ON tags FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete tags" 
ON tags FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Post_Tags Policies
-- Everyone can read post_tags
CREATE POLICY "Post_Tags are viewable by everyone" 
ON post_tags FOR SELECT 
USING (true);

-- Authenticated users (authors) can insert/delete their own post tags (via post ownership)
-- Or simpler: allow authenticated users to link tags if they own the post.
-- For simplicity, let's allow authors to manage tags for their posts.

CREATE POLICY "Authors can insert post_tags" 
ON post_tags FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_tags.post_id AND posts.created_by = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Authors can delete post_tags" 
ON post_tags FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_tags.post_id AND posts.created_by = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
