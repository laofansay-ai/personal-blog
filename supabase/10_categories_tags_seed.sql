-- Seed Categories
INSERT INTO categories (name, slug) VALUES
('Technology', 'technology'),
('Life', 'life'),
('Cyberpunk', 'cyberpunk')
ON CONFLICT (slug) DO NOTHING;

-- Seed Tags
INSERT INTO tags (name, slug) VALUES
('Next.js', 'nextjs'),
('Supabase', 'supabase'),
('React', 'react'),
('Design', 'design'),
('Coding', 'coding')
ON CONFLICT (slug) DO NOTHING;

-- Assign Categories to existing posts (randomly or specifically)
-- Assuming we have some posts from 03_seed.sql
UPDATE posts 
SET category_id = (SELECT id FROM categories WHERE slug = 'technology')
WHERE slug = 'dev-env-extreme';

UPDATE posts 
SET category_id = (SELECT id FROM categories WHERE slug = 'life')
WHERE slug = 'cyber-city-night';

-- Link Tags to Posts
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p, tags t
WHERE p.slug = 'dev-env-extreme' AND t.slug IN ('nextjs', 'supabase', 'coding')
ON CONFLICT DO NOTHING;

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p, tags t
WHERE p.slug = 'cyber-city-night' AND t.slug IN ('design', 'cyberpunk')
ON CONFLICT DO NOTHING;
