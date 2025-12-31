alter table public.posts
add column if not exists created_by uuid references auth.users(id);

create index if not exists posts_created_by_idx on public.posts (created_by);
