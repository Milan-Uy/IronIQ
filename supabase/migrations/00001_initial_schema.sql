-- IronIQ Initial Schema
-- All tables with RLS policies

-- =============================================================================
-- PROFILES
-- =============================================================================
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  fitness_goal text check (fitness_goal in ('hypertrophy', 'strength', 'general')),
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced')),
  preferred_split text check (preferred_split in ('ppl', 'upper_lower', 'full_body')),
  workouts_per_week int check (workouts_per_week between 1 and 7),
  body_specialization text[],
  weight_unit text not null default 'lbs' check (weight_unit in ('lbs', 'kg')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- WORKOUT PROGRAMS
-- =============================================================================
create table public.workout_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  name text not null,
  split_type text not null check (split_type in ('ppl', 'upper_lower', 'full_body')),
  days_per_week int not null check (days_per_week between 1 and 7),
  is_template boolean not null default false,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workout_programs enable row level security;

create policy "Users can view their own programs"
  on public.workout_programs for select
  using (auth.uid() = user_id or is_template = true);

create policy "Users can insert their own programs"
  on public.workout_programs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own programs"
  on public.workout_programs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own programs"
  on public.workout_programs for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- WORKOUT DAYS
-- =============================================================================
create table public.workout_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.workout_programs on delete cascade,
  name text not null,
  day_order int not null,
  target_muscles text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.workout_days enable row level security;

create policy "Users can view workout days for their programs"
  on public.workout_days for select
  using (
    exists (
      select 1 from public.workout_programs
      where id = workout_days.program_id
      and (user_id = auth.uid() or is_template = true)
    )
  );

create policy "Users can insert workout days for their programs"
  on public.workout_days for insert
  with check (
    exists (
      select 1 from public.workout_programs
      where id = workout_days.program_id and user_id = auth.uid()
    )
  );

create policy "Users can update workout days for their programs"
  on public.workout_days for update
  using (
    exists (
      select 1 from public.workout_programs
      where id = workout_days.program_id and user_id = auth.uid()
    )
  );

create policy "Users can delete workout days for their programs"
  on public.workout_days for delete
  using (
    exists (
      select 1 from public.workout_programs
      where id = workout_days.program_id and user_id = auth.uid()
    )
  );

-- =============================================================================
-- WORKOUT EXERCISES
-- =============================================================================
create table public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.workout_days on delete cascade,
  exercise_name text not null,
  target_sets int not null,
  target_reps text not null,
  rest_seconds int,
  exercise_order int not null,
  notes text,
  alternatives jsonb,
  created_at timestamptz not null default now()
);

alter table public.workout_exercises enable row level security;

create policy "Users can view exercises for their workout days"
  on public.workout_exercises for select
  using (
    exists (
      select 1 from public.workout_days wd
      join public.workout_programs wp on wp.id = wd.program_id
      where wd.id = workout_exercises.day_id
      and (wp.user_id = auth.uid() or wp.is_template = true)
    )
  );

create policy "Users can insert exercises for their workout days"
  on public.workout_exercises for insert
  with check (
    exists (
      select 1 from public.workout_days wd
      join public.workout_programs wp on wp.id = wd.program_id
      where wd.id = workout_exercises.day_id and wp.user_id = auth.uid()
    )
  );

create policy "Users can update exercises for their workout days"
  on public.workout_exercises for update
  using (
    exists (
      select 1 from public.workout_days wd
      join public.workout_programs wp on wp.id = wd.program_id
      where wd.id = workout_exercises.day_id and wp.user_id = auth.uid()
    )
  );

create policy "Users can delete exercises for their workout days"
  on public.workout_exercises for delete
  using (
    exists (
      select 1 from public.workout_days wd
      join public.workout_programs wp on wp.id = wd.program_id
      where wd.id = workout_exercises.day_id and wp.user_id = auth.uid()
    )
  );

-- =============================================================================
-- WORKOUT SESSIONS
-- =============================================================================
create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  day_id uuid not null references public.workout_days on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  notes text,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed'))
);

alter table public.workout_sessions enable row level security;

create policy "Users can view their own sessions"
  on public.workout_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sessions"
  on public.workout_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
  on public.workout_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sessions"
  on public.workout_sessions for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- SESSION SETS
-- =============================================================================
create table public.session_sets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions on delete cascade,
  exercise_name text not null,
  set_number int not null,
  reps int not null,
  weight decimal not null,
  rpe decimal check (rpe between 1 and 10),
  is_warmup boolean not null default false,
  was_substituted boolean not null default false,
  original_exercise text,
  created_at timestamptz not null default now()
);

alter table public.session_sets enable row level security;

create policy "Users can view their own session sets"
  on public.session_sets for select
  using (
    exists (
      select 1 from public.workout_sessions
      where id = session_sets.session_id and user_id = auth.uid()
    )
  );

create policy "Users can insert their own session sets"
  on public.session_sets for insert
  with check (
    exists (
      select 1 from public.workout_sessions
      where id = session_sets.session_id and user_id = auth.uid()
    )
  );

create policy "Users can update their own session sets"
  on public.session_sets for update
  using (
    exists (
      select 1 from public.workout_sessions
      where id = session_sets.session_id and user_id = auth.uid()
    )
  );

create policy "Users can delete their own session sets"
  on public.session_sets for delete
  using (
    exists (
      select 1 from public.workout_sessions
      where id = session_sets.session_id and user_id = auth.uid()
    )
  );

-- =============================================================================
-- CHAT MESSAGES
-- =============================================================================
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  structured_data jsonb,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

create policy "Users can view their own messages"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert their own messages"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

-- =============================================================================
-- INDEXES
-- =============================================================================
create index idx_workout_programs_user_id on public.workout_programs(user_id);
create index idx_workout_days_program_id on public.workout_days(program_id);
create index idx_workout_exercises_day_id on public.workout_exercises(day_id);
create index idx_workout_sessions_user_id on public.workout_sessions(user_id);
create index idx_workout_sessions_day_id on public.workout_sessions(day_id);
create index idx_session_sets_session_id on public.session_sets(session_id);
create index idx_chat_messages_user_id on public.chat_messages(user_id);
