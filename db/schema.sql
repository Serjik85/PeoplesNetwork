-- PeoplesNetwork MVP schema (PostgreSQL)

create extension if not exists "pgcrypto";

create type user_role as enum ('builder', 'project_owner', 'both');
create type experience_level as enum ('junior', 'middle', 'senior', 'lead');
create type work_mode as enum ('remote', 'hybrid', 'onsite');
create type commitment_level as enum ('weekends', 'part_time', 'half_time', 'full_time');
create type project_stage as enum ('idea', 'validation', 'mvp', 'launched');
create type collaboration_type as enum ('core_team', 'contributor', 'cofounder');
create type match_status as enum ('suggested', 'accepted', 'rejected', 'intro_sent', 'meeting_done');
create type intro_status as enum ('pending', 'sent', 'replied', 'closed');
create type join_request_status as enum ('pending', 'approved', 'rejected');

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  headline text,
  bio text,
  role user_role not null default 'builder',
  experience experience_level not null default 'middle',
  timezone text not null,
  country text,
  city text,
  work_mode_preference work_mode not null default 'remote',
  weekly_hours smallint not null check (weekly_hours between 1 and 80),
  commitment commitment_level not null default 'part_time',
  github_url text,
  linkedin_url text,
  portfolio_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null
);

create table user_skills (
  user_id uuid not null references users(id) on delete cascade,
  skill_id uuid not null references skills(id) on delete cascade,
  level smallint not null check (level between 1 and 5),
  years numeric(3,1) not null check (years between 0 and 40),
  primary key (user_id, skill_id)
);

create table interests (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

create table user_interests (
  user_id uuid not null references users(id) on delete cascade,
  interest_id uuid not null references interests(id) on delete cascade,
  primary key (user_id, interest_id)
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  title text not null,
  one_liner text not null,
  description text not null,
  stage project_stage not null default 'idea',
  domain text not null,
  repo_url text,
  demo_url text,
  target_market text,
  is_paid boolean not null default false,
  equity_possible boolean not null default false,
  weekly_hours_expected smallint not null check (weekly_hours_expected between 1 and 80),
  collaboration collaboration_type not null default 'core_team',
  timezone_preference text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_roles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text,
  min_experience experience_level not null default 'middle',
  weekly_hours_min smallint not null check (weekly_hours_min between 1 and 80),
  seats smallint not null default 1 check (seats between 1 and 20),
  is_open boolean not null default true
);

create table project_role_skills (
  project_role_id uuid not null references project_roles(id) on delete cascade,
  skill_id uuid not null references skills(id) on delete cascade,
  required_level smallint not null check (required_level between 1 and 5),
  weight smallint not null default 1 check (weight between 1 and 5),
  primary key (project_role_id, skill_id)
);

create table project_interests (
  project_id uuid not null references projects(id) on delete cascade,
  interest_id uuid not null references interests(id) on delete cascade,
  primary key (project_id, interest_id)
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  project_role_id uuid references project_roles(id) on delete set null,
  score_total numeric(5,2) not null check (score_total between 0 and 100),
  score_skill numeric(5,2) not null,
  score_goal numeric(5,2) not null,
  score_availability numeric(5,2) not null,
  score_timezone numeric(5,2) not null,
  score_commitment numeric(5,2) not null,
  status match_status not null default 'suggested',
  source text not null default 'manual', -- manual | algorithm
  curator_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, project_id, project_role_id)
);

create table intros (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null unique references matches(id) on delete cascade,
  curator_user_id uuid not null references users(id) on delete restrict,
  intro_text text not null,
  status intro_status not null default 'pending',
  sent_at timestamptz,
  replied_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table project_join_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  role_id uuid references project_roles(id) on delete set null,
  applicant_email text not null,
  applicant_name text not null,
  motivation text not null,
  hours_per_week smallint not null check (hours_per_week between 1 and 40),
  status join_request_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table waitlist_submissions (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  role user_role not null default 'builder',
  stack text[] not null default '{}',
  weekly_hours smallint not null check (weekly_hours between 1 and 80),
  timezone text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful indexes for feed + matching dashboard
create index idx_users_active on users(is_active);
create index idx_projects_active_created on projects(is_active, created_at desc);
create index idx_project_roles_open on project_roles(project_id, is_open);
create index idx_matches_status_score on matches(status, score_total desc);
create index idx_matches_user on matches(user_id, created_at desc);
create index idx_matches_project on matches(project_id, created_at desc);
create index idx_join_requests_project on project_join_requests(project_id, created_at desc);
create index idx_waitlist_created on waitlist_submissions(created_at desc);

-- Trigger to maintain updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at
before update on users
for each row execute function set_updated_at();

create trigger trg_projects_updated_at
before update on projects
for each row execute function set_updated_at();

create trigger trg_matches_updated_at
before update on matches
for each row execute function set_updated_at();

create trigger trg_waitlist_updated_at
before update on waitlist_submissions
for each row execute function set_updated_at();
