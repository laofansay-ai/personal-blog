insert into public.profiles (id, role)
values ('00000000-0000-0000-0000-000000000000', 'admin')
on conflict (id) do update set role = excluded.role;
