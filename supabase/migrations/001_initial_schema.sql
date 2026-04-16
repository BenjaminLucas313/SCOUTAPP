-- ============================================================
-- Scout App — schema inicial
-- Correr en Supabase SQL Editor o con supabase db push
-- ============================================================

-- Extensiones
create extension if not exists "uuid-ossp";

-- ─── Leagues ──────────────────────────────────────────────────────────────────
create table if not exists leagues (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  country    text not null,
  level      integer not null default 1 check (level between 1 and 10),
  logo_url   text,
  created_at timestamptz not null default now()
);

-- ─── Clubs ───────────────────────────────────────────────────────────────────
create table if not exists clubs (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  league_id  uuid references leagues (id) on delete set null,
  country    text not null,
  logo_url   text,
  created_at timestamptz not null default now()
);

create index if not exists clubs_league_id_idx on clubs (league_id);

-- ─── Players ─────────────────────────────────────────────────────────────────
create table if not exists players (
  id                   uuid primary key default uuid_generate_v4(),
  name                 text not null,
  birth_date           date,
  nationality          text,
  position             text not null,
  secondary_positions  text[] not null default '{}',
  foot                 text check (foot in ('right', 'left', 'both')),
  height_cm            integer check (height_cm between 140 and 220),
  weight_kg            integer check (weight_kg between 40 and 130),
  club_id              uuid references clubs (id) on delete set null,
  market_value         integer,   -- en miles de EUR
  contract_until       date,
  photo_url            text,
  attributes           jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists players_name_idx      on players using gin (to_tsvector('simple', name));
create index if not exists players_position_idx  on players (position);
create index if not exists players_club_id_idx   on players (club_id);
create index if not exists players_attributes_idx on players using gin (attributes);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists players_updated_at on players;
create trigger players_updated_at
  before update on players
  for each row execute function update_updated_at();

-- ─── Scout notes ─────────────────────────────────────────────────────────────
create table if not exists scout_notes (
  id          uuid primary key default uuid_generate_v4(),
  player_id   uuid not null references players (id) on delete cascade,
  scout_id    uuid not null,  -- auth.users(id) — se vincula cuando tengamos auth
  content     text not null,
  rating      integer check (rating between 1 and 10),
  observed_at date,
  created_at  timestamptz not null default now()
);

create index if not exists scout_notes_player_id_idx on scout_notes (player_id);
create index if not exists scout_notes_scout_id_idx  on scout_notes (scout_id);

-- ─── Shortlists ──────────────────────────────────────────────────────────────
create table if not exists shortlists (
  id          uuid primary key default uuid_generate_v4(),
  scout_id    uuid not null,
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

create index if not exists shortlists_scout_id_idx on shortlists (scout_id);

-- ─── Shortlist players (pivot) ────────────────────────────────────────────────
create table if not exists shortlist_players (
  shortlist_id       uuid not null references shortlists (id) on delete cascade,
  player_id          uuid not null references players (id) on delete cascade,
  added_at           timestamptz not null default now(),
  position_override  text,
  primary key (shortlist_id, player_id)
);

create index if not exists sp_shortlist_id_idx on shortlist_players (shortlist_id);
create index if not exists sp_player_id_idx    on shortlist_players (player_id);

-- ─── RLS (Row Level Security) — base para MVP ─────────────────────────────────
-- Por ahora todo es público para facilitar desarrollo.
-- En producción: activar RLS y agregar policies por scout_id = auth.uid()

alter table leagues          enable row level security;
alter table clubs            enable row level security;
alter table players          enable row level security;
alter table scout_notes      enable row level security;
alter table shortlists       enable row level security;
alter table shortlist_players enable row level security;

-- Policies permisivas para MVP (reemplazar antes de producción)
create policy "allow all leagues"           on leagues           for all using (true) with check (true);
create policy "allow all clubs"             on clubs             for all using (true) with check (true);
create policy "allow all players"           on players           for all using (true) with check (true);
create policy "allow all scout_notes"       on scout_notes       for all using (true) with check (true);
create policy "allow all shortlists"        on shortlists        for all using (true) with check (true);
create policy "allow all shortlist_players" on shortlist_players for all using (true) with check (true);

-- ─── Seed de ejemplo ─────────────────────────────────────────────────────────
insert into leagues (name, country, level) values
  ('Primera División', 'Argentina', 1),
  ('Primera Nacional', 'Argentina', 2),
  ('Liga Profesional',  'Argentina', 1)
on conflict do nothing;
