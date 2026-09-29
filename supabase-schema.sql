-- ============================================================
--  Flashcard Study App — Supabase SQL Schema
--  Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── DECKS ────────────────────────────────────────────────────
create table public.decks (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  description  text not null default '',
  emoji        text not null default '📚',
  color        text not null default 'violet',
  last_studied timestamptz,
  created_at   timestamptz not null default now()
);

-- ─── FLASHCARDS ───────────────────────────────────────────────
create table public.flashcards (
  id           uuid primary key default uuid_generate_v4(),
  deck_id      uuid not null references public.decks(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  front        text not null,
  back         text not null,
  mastered     boolean not null default false,
  review_count integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ─── STUDY SESSIONS ───────────────────────────────────────────
create table public.study_sessions (
  id           uuid primary key default uuid_generate_v4(),
  deck_id      uuid not null references public.decks(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  total        integer not null,
  correct      integer not null,
  incorrect    integer not null,
  started_at   timestamptz not null default now(),
  completed_at timestamptz
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
alter table public.decks          enable row level security;
alter table public.flashcards     enable row level security;
alter table public.study_sessions enable row level security;

-- Decks policies
create policy "Users can read their own decks"
  on public.decks for select using (auth.uid() = user_id);

create policy "Users can insert their own decks"
  on public.decks for insert with check (auth.uid() = user_id);

create policy "Users can update their own decks"
  on public.decks for update using (auth.uid() = user_id);

create policy "Users can delete their own decks"
  on public.decks for delete using (auth.uid() = user_id);

-- Flashcards policies
create policy "Users can read their own flashcards"
  on public.flashcards for select using (auth.uid() = user_id);

create policy "Users can insert their own flashcards"
  on public.flashcards for insert with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
  on public.flashcards for update using (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
  on public.flashcards for delete using (auth.uid() = user_id);

-- Study sessions policies
create policy "Users can read their own study sessions"
  on public.study_sessions for select using (auth.uid() = user_id);

create policy "Users can insert their own study sessions"
  on public.study_sessions for insert with check (auth.uid() = user_id);

-- ─── PERFORMANCE INDEXES ──────────────────────────────────────
create index on public.decks(user_id);
create index on public.flashcards(deck_id);
create index on public.flashcards(user_id);
create index on public.study_sessions(deck_id);
create index on public.study_sessions(user_id);
