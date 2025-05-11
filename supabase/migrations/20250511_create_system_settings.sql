create table if not exists public.system_settings (
  id uuid default uuid_generate_v4() primary key,
  privacy_policy jsonb not null default '{}'::jsonb,
  terms_of_use jsonb not null default '{}'::jsonb,
  cookie_policy jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar função para atualizar o updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Criar trigger para atualizar o updated_at
create trigger set_updated_at
  before update on public.system_settings
  for each row
  execute function public.handle_updated_at();

-- Inserir configurações padrão
insert into public.system_settings (id)
values (uuid_generate_v4())
on conflict do nothing;
