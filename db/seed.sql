-- Demo data for local frontend prototyping

insert into skills (slug, name, category) values
('react', 'React', 'frontend'),
('nextjs', 'Next.js', 'frontend'),
('typescript', 'TypeScript', 'language'),
('nodejs', 'Node.js', 'backend'),
('postgresql', 'PostgreSQL', 'database')
on conflict (slug) do nothing;

insert into interests (slug, name) values
('ai-tools', 'AI Tools'),
('devtools', 'Developer Tools'),
('saas', 'SaaS')
on conflict (slug) do nothing;

with created_users as (
  insert into users (email, full_name, headline, bio, role, experience, timezone, country, city, weekly_hours, commitment, github_url)
  values
  ('anna@example.com', 'Anna Madsen', 'Senior Frontend Engineer', 'Love building fast product MVPs.', 'builder', 'senior', 'Europe/Copenhagen', 'Denmark', 'Copenhagen', 15, 'part_time', 'https://github.com/anna'),
  ('mark@example.com', 'Mark Jensen', 'Product-minded Fullstack', 'Hosting short coding practice sprints.', 'both', 'middle', 'Europe/Berlin', 'Germany', 'Berlin', 20, 'part_time', 'https://github.com/mark')
  on conflict (email) do update set full_name = excluded.full_name
  returning id, email
),
anna as (
  select id from users where email = 'anna@example.com'
),
mark as (
  select id from users where email = 'mark@example.com'
),
project as (
  insert into projects (
    owner_id, title, one_liner, description, stage, domain, target_market,
    is_paid, equity_possible, weekly_hours_expected, collaboration, timezone_preference
  )
  values (
    (select id from mark),
    'PairBoard',
    'Practice project for building a shared kanban board',
    'A 3-week learning sprint where the team builds a collaborative kanban app.',
    'mvp',
    'DevTools',
    'Developers practicing team collaboration',
    false,
    false,
    10,
    'core_team',
    'Europe/*'
  )
  returning id
),
role as (
  insert into project_roles (project_id, title, description, min_experience, weekly_hours_min, seats)
  values (
    (select id from project),
    'Frontend Practice Buddy',
    'Pair-program dashboard UX and core screens in Next.js.',
    'middle',
    6,
    1
  )
  returning id
)
insert into project_role_skills (project_role_id, skill_id, required_level, weight)
select (select id from role), s.id,
  case when s.slug in ('react', 'nextjs') then 4 else 3 end,
  case when s.slug in ('react', 'nextjs') then 5 else 3 end
from skills s
where s.slug in ('react', 'nextjs', 'typescript')
on conflict do nothing;

insert into user_skills (user_id, skill_id, level, years)
select u.id, s.id,
  case when s.slug = 'react' then 5 when s.slug = 'nextjs' then 4 else 4 end,
  case when s.slug = 'react' then 6.0 when s.slug = 'nextjs' then 4.0 else 5.0 end
from users u
join skills s on s.slug in ('react', 'nextjs', 'typescript')
where u.email = 'anna@example.com'
on conflict do nothing;

insert into user_interests (user_id, interest_id)
select u.id, i.id
from users u
join interests i on i.slug in ('devtools', 'saas')
where u.email = 'anna@example.com'
on conflict do nothing;

insert into project_interests (project_id, interest_id)
select p.id, i.id
from projects p
join interests i on i.slug in ('devtools', 'saas')
where p.title = 'PairBoard'
on conflict do nothing;

insert into matches (
  user_id, project_id, project_role_id,
  score_total, score_skill, score_goal, score_availability, score_timezone, score_commitment,
  status, source, curator_note
)
select
  u.id,
  p.id,
  pr.id,
  82.50, 34.00, 20.00, 11.00, 9.00, 8.50,
  'suggested', 'manual',
  'Strong React + timezone fit for a 3-week practice sprint.'
from users u
join projects p on p.title = 'PairBoard'
join project_roles pr on pr.project_id = p.id and pr.title = 'Frontend Practice Buddy'
where u.email = 'anna@example.com'
on conflict do nothing;

insert into intros (match_id, curator_user_id, intro_text, status, sent_at)
select
  m.id,
  owner.id,
  'Anna, meet Mark. Great fit for the PairBoard practice sprint.',
  'sent',
  now()
from matches m
join users owner on owner.email = 'mark@example.com'
join users candidate on candidate.id = m.user_id and candidate.email = 'anna@example.com'
where not exists (
  select 1 from intros i where i.match_id = m.id
);

insert into waitlist_submissions (email, full_name, role, stack, weekly_hours, timezone)
values
  ('demo1@example.com', 'Liam Founder', 'project_owner', array['nextjs', 'typescript'], 8, 'Europe/Paris'),
  ('demo2@example.com', 'Eva Builder', 'builder', array['react', 'nodejs'], 12, 'Europe/Copenhagen')
on conflict (email) do nothing;

insert into project_join_requests (
  project_id, role_id, applicant_email, applicant_name, motivation, hours_per_week, status
)
select
  p.id,
  pr.id,
  'nina@example.com',
  'Nina Builder',
  'I want to practice pair programming, teamwork rituals, and ship a useful demo in 3 weeks.',
  8,
  'pending'
from projects p
join project_roles pr on pr.project_id = p.id and pr.title = 'Frontend Practice Buddy'
where p.title = 'PairBoard'
and not exists (
  select 1
  from project_join_requests jr
  where jr.project_id = p.id
    and jr.applicant_email = 'nina@example.com'
);

-- Bulk demo dataset: 20 builders + additional projects + join requests

with demo_numbers as (
  select generate_series(1, 20) as n
)
insert into users (
  email,
  full_name,
  headline,
  bio,
  role,
  experience,
  timezone,
  country,
  city,
  weekly_hours,
  commitment
)
select
  'learner' || lpad(n::text, 2, '0') || '@example.com' as email,
  'Learner ' || lpad(n::text, 2, '0') as full_name,
  case
    when n % 2 = 0 then 'Frontend practice builder'
    else 'Fullstack practice builder'
  end as headline,
  'Looking for short team sprints to practice collaboration and ship demos.' as bio,
  case
    when n % 5 = 0 then 'both'::user_role
    when n % 3 = 0 then 'project_owner'::user_role
    else 'builder'::user_role
  end as role,
  case
    when n % 4 = 0 then 'senior'::experience_level
    when n % 4 = 1 then 'junior'::experience_level
    when n % 4 = 2 then 'middle'::experience_level
    else 'lead'::experience_level
  end as experience,
  case
    when n % 3 = 0 then 'Europe/Berlin'
    when n % 3 = 1 then 'Europe/Copenhagen'
    else 'Europe/Paris'
  end as timezone,
  'EU' as country,
  case
    when n % 3 = 0 then 'Berlin'
    when n % 3 = 1 then 'Copenhagen'
    else 'Paris'
  end as city,
  6 + (n % 11) as weekly_hours,
  case
    when n % 4 = 0 then 'weekends'::commitment_level
    when n % 4 = 1 then 'part_time'::commitment_level
    when n % 4 = 2 then 'half_time'::commitment_level
    else 'part_time'::commitment_level
  end as commitment
from demo_numbers
on conflict (email) do nothing;

insert into user_skills (user_id, skill_id, level, years)
select
  u.id,
  s.id,
  case
    when s.slug = 'react' then 3 + ((substring(u.email from 8 for 2)::int) % 3)
    when s.slug = 'nextjs' then 2 + ((substring(u.email from 8 for 2)::int) % 3)
    when s.slug = 'typescript' then 3 + ((substring(u.email from 8 for 2)::int) % 2)
    else 2
  end as level,
  1.5 + ((substring(u.email from 8 for 2)::int) % 5) as years
from users u
join skills s on s.slug in ('react', 'nextjs', 'typescript')
where u.email like 'learner%@example.com'
on conflict (user_id, skill_id) do nothing;

with owners as (
  select
    id,
    row_number() over (order by email) as rn
  from users
  where email like 'learner%@example.com'
  limit 8
)
insert into projects (
  owner_id,
  title,
  one_liner,
  description,
  stage,
  domain,
  target_market,
  is_paid,
  equity_possible,
  weekly_hours_expected,
  collaboration,
  timezone_preference
)
select
  o.id,
  'Practice Sprint ' || o.rn,
  'Small team sprint #' || o.rn || ' to ship a useful demo',
  'A structured 2-4 week sprint for practicing teamwork, code reviews, and demo delivery.',
  case when o.rn % 2 = 0 then 'mvp'::project_stage else 'validation'::project_stage end,
  case when o.rn % 2 = 0 then 'DevTools' else 'SaaS' end,
  'Developers who want collaborative practice',
  false,
  false,
  8 + (o.rn % 8),
  'core_team'::collaboration_type,
  'Europe/*'
from owners o
where not exists (
  select 1 from projects p where p.title = 'Practice Sprint ' || o.rn
);

insert into project_roles (
  project_id,
  title,
  description,
  min_experience,
  weekly_hours_min,
  seats,
  is_open
)
select
  p.id,
  case when p.title like '%1' or p.title like '%3' or p.title like '%5' or p.title like '%7'
    then 'Frontend Practice Buddy'
    else 'Fullstack Practice Buddy'
  end,
  'Join a small team, contribute weekly, and help ship the sprint demo.',
  'middle',
  6,
  2,
  true
from projects p
where p.title like 'Practice Sprint %'
and not exists (
  select 1 from project_roles pr where pr.project_id = p.id
);

insert into project_role_skills (project_role_id, skill_id, required_level, weight)
select
  pr.id,
  s.id,
  case when s.slug in ('react', 'nextjs') then 3 else 2 end,
  case when s.slug in ('react', 'nextjs') then 5 else 3 end
from project_roles pr
join projects p on p.id = pr.project_id
join skills s on s.slug in ('react', 'nextjs', 'typescript')
where p.title like 'Practice Sprint %'
on conflict (project_role_id, skill_id) do nothing;

with applicants as (
  select
    email,
    full_name,
    row_number() over (order by email) as rn
  from users
  where email like 'learner%@example.com'
),
slots as (
  select
    pr.id as role_id,
    p.id as project_id,
    row_number() over (order by p.title, pr.id) as rn,
    count(*) over () as total
  from project_roles pr
  join projects p on p.id = pr.project_id
  where p.title like 'Practice Sprint %'
),
gen as (
  select generate_series(1, 20) as i
)
insert into project_join_requests (
  project_id,
  role_id,
  applicant_email,
  applicant_name,
  motivation,
  hours_per_week,
  status
)
select
  s.project_id,
  s.role_id,
  a.email,
  a.full_name,
  'I want to join this sprint to practice coding in a team and ship a clean demo.',
  6 + (g.i % 8),
  case
    when g.i % 5 = 0 then 'approved'::join_request_status
    when g.i % 7 = 0 then 'rejected'::join_request_status
    else 'pending'::join_request_status
  end
from gen g
join applicants a on a.rn = g.i
join slots s on s.rn = ((g.i - 1) % s.total) + 1
where not exists (
  select 1
  from project_join_requests jr
  where jr.project_id = s.project_id
    and jr.applicant_email = a.email
);

insert into matches (
  user_id,
  project_id,
  project_role_id,
  score_total,
  score_skill,
  score_goal,
  score_availability,
  score_timezone,
  score_commitment,
  status,
  source,
  curator_note
)
select
  u.id,
  jr.project_id,
  jr.role_id,
  74 + (row_number() over (order by jr.created_at) % 18),
  28,
  18,
  10,
  9,
  9,
  case
    when jr.status = 'approved' then 'accepted'::match_status
    when jr.status = 'rejected' then 'rejected'::match_status
    else 'suggested'::match_status
  end,
  'manual',
  'Generated from demo join request dataset'
from project_join_requests jr
join users u on u.email = jr.applicant_email
where jr.applicant_email like 'learner%@example.com'
on conflict (user_id, project_id, project_role_id) do nothing;
