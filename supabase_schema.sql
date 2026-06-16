create extension if not exists "pgcrypto";

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  status text not null default 'lobby',
  target_score integer not null default 21,
  current_round_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  name text not null,
  score integer not null default 0,
  seat_order integer not null,
  is_host boolean not null default false,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  text_et text not null,
  category text not null default 'default',
  is_custom boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists rounds (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  round_number integer not null,
  question_id uuid references questions(id),
  custom_question_text text,
  hot_seat_player_id uuid not null references players(id) on delete cascade,
  status text not null default 'question',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table games
add constraint games_current_round_fk
foreign key (current_round_id)
references rounds(id)
on delete set null;

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references rounds(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  answer_text text not null,
  is_hot_seat_answer boolean not null default false,
  display_order integer,
  created_at timestamptz not null default now(),
  unique(round_id, player_id)
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references rounds(id) on delete cascade,
  voter_player_id uuid not null references players(id) on delete cascade,
  answer_id uuid not null references answers(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(round_id, voter_player_id)
);

alter publication supabase_realtime add table games;
alter publication supabase_realtime add table players;
alter publication supabase_realtime add table rounds;
alter publication supabase_realtime add table answers;
alter publication supabase_realtime add table votes;

-- MVP-s ei kasuta kasutajakontosid (vt DATABASE_SUPABASE.md punkt 10),
-- seega lülitame RLS lihtsuse mõttes välja. Supabase lülitab uutel
-- projektidel RLS vaikimisi sisse, mis blokeeriks kõik anon-kliendi kirjutused.
alter table games disable row level security;
alter table players disable row level security;
alter table questions disable row level security;
alter table rounds disable row level security;
alter table answers disable row level security;
alter table votes disable row level security;
