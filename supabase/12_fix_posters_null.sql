-- Update existing posts to ensure posters field is an empty array instead of null
UPDATE public.posts 
SET posters = '{}'
WHERE posters IS NULL;

-- Also ensure the default value is set properly
ALTER TABLE public.posts 
ALTER COLUMN posters SET DEFAULT '{}';