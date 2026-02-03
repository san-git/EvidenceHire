create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company text,
  title text,
  created_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status text default 'active',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists project_members (
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'member',
  created_at timestamptz default now(),
  primary key (project_id, user_id)
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  location text,
  level text,
  jd_text text,
  created_at timestamptz default now()
);

create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  email text,
  source text,
  resume_text text,
  created_at timestamptz default now()
);

create table if not exists match_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  run_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists match_results (
  id uuid primary key default gen_random_uuid(),
  match_run_id uuid references match_runs(id) on delete cascade,
  role_id uuid references roles(id) on delete cascade,
  candidate_id uuid references candidates(id) on delete cascade,
  score integer not null,
  evidence jsonb default '[]'::jsonb,
  gaps jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  role_id uuid references roles(id) on delete set null,
  candidate_id uuid references candidates(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null,
  content text not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_members enable row level security;
alter table roles enable row level security;
alter table candidates enable row level security;
alter table match_runs enable row level security;
alter table match_results enable row level security;
alter table notes enable row level security;

create policy "Profiles are self readable" on profiles
  for select using (auth.uid() = id);
create policy "Profiles are self writable" on profiles
  for insert with check (auth.uid() = id);
create policy "Profiles are self updatable" on profiles
  for update using (auth.uid() = id);

create policy "Projects are visible to members" on projects
  for select using (
    exists (
      select 1 from project_members pm
      where pm.project_id = projects.id
      and pm.user_id = auth.uid()
    )
  );
create policy "Projects can be created by authed users" on projects
  for insert with check (auth.uid() = created_by);
create policy "Projects are updatable by owners" on projects
  for update using (
    exists (
      select 1 from project_members pm
      where pm.project_id = projects.id
      and pm.user_id = auth.uid()
      and pm.role = 'owner'
    )
  );

create policy "Members can read memberships" on project_members
  for select using (
    exists (
      select 1 from project_members pm
      where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid()
    )
  );
create policy "Owners can manage memberships" on project_members
  for insert with check (
    exists (
      select 1 from project_members pm
      where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid()
      and pm.role = 'owner'
    )
  );

create policy "Members can read roles" on roles
  for select using (
    exists (
      select 1 from project_members pm
      where pm.project_id = roles.project_id
      and pm.user_id = auth.uid()
    )
  );
create policy "Members can add roles" on roles
  for insert with check (
    exists (
      select 1 from project_members pm
      where pm.project_id = roles.project_id
      and pm.user_id = auth.uid()
    )
  );

create policy "Members can read candidates" on candidates
  for select using (
    exists (
      select 1 from project_members pm
      where pm.project_id = candidates.project_id
      and pm.user_id = auth.uid()
    )
  );
create policy "Members can add candidates" on candidates
  for insert with check (
    exists (
      select 1 from project_members pm
      where pm.project_id = candidates.project_id
      and pm.user_id = auth.uid()
    )
  );

create policy "Members can read match runs" on match_runs
  for select using (
    exists (
      select 1 from project_members pm
      where pm.project_id = match_runs.project_id
      and pm.user_id = auth.uid()
    )
  );
create policy "Members can add match runs" on match_runs
  for insert with check (
    exists (
      select 1 from project_members pm
      where pm.project_id = match_runs.project_id
      and pm.user_id = auth.uid()
    )
  );

create policy "Members can read match results" on match_results
  for select using (
    exists (
      select 1 from match_runs mr
      join project_members pm on pm.project_id = mr.project_id
      where mr.id = match_results.match_run_id
      and pm.user_id = auth.uid()
    )
  );
create policy "Members can add match results" on match_results
  for insert with check (
    exists (
      select 1 from match_runs mr
      join project_members pm on pm.project_id = mr.project_id
      where mr.id = match_results.match_run_id
      and pm.user_id = auth.uid()
    )
  );

create policy "Members can read notes" on notes
  for select using (
    exists (
      select 1 from project_members pm
      where pm.project_id = notes.project_id
      and pm.user_id = auth.uid()
    )
  );
create policy "Members can add notes" on notes
  for insert with check (
    exists (
      select 1 from project_members pm
      where pm.project_id = notes.project_id
      and pm.user_id = auth.uid()
    )
  );
