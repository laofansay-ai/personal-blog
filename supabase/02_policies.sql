alter table public.posts enable row level security;

create policy read_published_posts
on public.posts
for select
to authenticated, anon
using (status = 'published');
