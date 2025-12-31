create policy posts_select_own_drafts
on public.posts
for select
to authenticated
using (created_by = auth.uid());

create policy posts_select_admin_all
on public.posts
for select
to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy posts_insert_own
on public.posts
for insert
to authenticated
with check (created_by = auth.uid());

create policy posts_update_own
on public.posts
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy posts_update_admin
on public.posts
for update
to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy posts_delete_own
on public.posts
for delete
to authenticated
using (created_by = auth.uid());

create policy posts_delete_admin
on public.posts
for delete
to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
