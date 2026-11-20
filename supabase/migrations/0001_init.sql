-- ¡Hola! — Learn Spanish · schema khởi tạo
-- Chạy trong Supabase SQL Editor, hoặc: supabase db push

-- 1. Hồ sơ người dùng (tạo tự động khi đăng ký)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- 2. Tiến độ học: một dòng / người dùng, lưu nguyên ProgressState (src/lib/types.ts) dạng jsonb.
--    Cách này khớp 1-1 với LocalRepository nên chuyển từ localStorage sang DB không cần đổi UI.
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists user_progress_updated_at_idx on public.user_progress (updated_at desc);

-- 3. Row Level Security: mỗi người chỉ đọc/ghi dữ liệu của chính mình
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

drop policy if exists "profiles_self" on public.profiles;
create policy "profiles_self" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "progress_self" on public.user_progress;
create policy "progress_self" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. Tự tạo profile khi có user mới
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
