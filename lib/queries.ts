import { query } from "@/lib/db";
import type { JoinRequestItem, MatchItem, ProjectCard, ProjectDetails, PublicStats } from "@/lib/types";

const demoProject: ProjectDetails = {
  id: "demo-project-1",
  title: "PairBoard",
  one_liner: "Practice project for building a shared kanban board",
  description:
    "A 3-week learning sprint: design and build a collaborative kanban app with auth and realtime updates.",
  stage: "mvp",
  domain: "DevTools",
  target_market: "Startup engineering teams",
  weekly_hours_expected: 15,
  collaboration: "core_team",
  timezone_preference: "Europe/*",
  roles: [
    {
      id: "demo-role-1",
      title: "Frontend Practice Buddy",
      description: "Build the dashboard UX and pair-program key screens in Next.js.",
      min_experience: "middle",
      weekly_hours_min: 10,
      required_skills: [
        { slug: "react", required_level: 4, weight: 5 },
        { slug: "nextjs", required_level: 4, weight: 5 },
        { slug: "typescript", required_level: 3, weight: 3 }
      ]
    }
  ]
};

function fallbackStats(): PublicStats {
  return {
    active_project_requests: 1,
    builders_in_pipeline: 2,
    intros_last_14_days: 1
  };
}

function fallbackProjects(): ProjectCard[] {
  return [
    {
      id: demoProject.id,
      title: demoProject.title,
      one_liner: demoProject.one_liner,
      stage: demoProject.stage,
      domain: demoProject.domain,
      weekly_hours_expected: demoProject.weekly_hours_expected,
      collaboration: demoProject.collaboration,
      timezone_preference: demoProject.timezone_preference,
      top_skills: ["react", "nextjs", "typescript"]
    }
  ];
}

function fallbackMatches(): MatchItem[] {
  return [
    {
      match_id: "demo-match-1",
      project: {
        id: demoProject.id,
        title: demoProject.title,
        one_liner: demoProject.one_liner
      },
      role: {
        id: "demo-role-1",
        title: "Frontend Practice Buddy"
      },
      score_total: 82.5,
      score_breakdown: {
        skill: 34,
        goal: 20,
        availability: 11,
        timezone: 9,
        commitment: 8.5
      },
      status: "suggested",
      curator_note: "Demo mode: database is offline, showing a sample team recommendation."
    }
  ];
}

function fallbackJoinRequests(): JoinRequestItem[] {
  return [
    {
      id: "demo-request-1",
      project_id: "demo-project-1",
      project_title: "PairBoard",
      role_id: "demo-role-1",
      role_title: "Frontend Practice Buddy",
      applicant_email: "demo.builder@example.com",
      applicant_name: "Nina Builder",
      motivation: "I want to practice pair programming and ship a small demo in this sprint.",
      hours_per_week: 8,
      status: "pending",
      created_at: new Date().toISOString()
    }
  ];
}

async function withFallback<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown DB error";
    console.warn(`[queries] ${label} fallback enabled: ${message}`);
    return fallback;
  }
}

export async function getPublicStats(): Promise<PublicStats> {
  return withFallback(
    "getPublicStats",
    async () => {
      const rows = await query<PublicStats>(
        `
        select
          (select count(*)::int from projects where is_active = true) as active_project_requests,
          (select count(*)::int from users where is_active = true) as builders_in_pipeline,
          (
            select count(*)::int
            from intros
            where created_at >= now() - interval '14 days'
          ) as intros_last_14_days
        `
      );

      return rows[0];
    },
    fallbackStats()
  );
}

export async function getProjects(stage?: string): Promise<ProjectCard[]> {
  return withFallback(
    "getProjects",
    async () => {
      const params: unknown[] = [];
      const filters: string[] = ["p.is_active = true"];

      if (stage) {
        params.push(stage);
        filters.push(`p.stage = $${params.length}`);
      }

      const rows = await query<
        Omit<ProjectCard, "top_skills"> & { top_skills: string[] | null }
      >(
        `
        select
          p.id,
          p.title,
          p.one_liner,
          p.stage::text,
          p.domain,
          p.weekly_hours_expected,
          p.collaboration::text,
          p.timezone_preference,
          array_remove(array_agg(distinct s.slug), null) as top_skills
        from projects p
        left join project_roles pr on pr.project_id = p.id and pr.is_open = true
        left join project_role_skills prs on prs.project_role_id = pr.id
        left join skills s on s.id = prs.skill_id
        where ${filters.join(" and ")}
        group by p.id
        order by p.created_at desc
        limit 50
        `,
        params
      );

      return rows.map((item) => ({
        ...item,
        top_skills: item.top_skills ?? []
      }));
    },
    fallbackProjects()
  );
}

export async function getProjectById(projectId: string): Promise<ProjectDetails | null> {
  return withFallback(
    "getProjectById",
    async () => {
      const projectRows = await query<Omit<ProjectDetails, "roles">>(
        `
        select
          p.id,
          p.title,
          p.one_liner,
          p.description,
          p.stage::text,
          p.domain,
          p.target_market,
          p.weekly_hours_expected,
          p.collaboration::text,
          p.timezone_preference
        from projects p
        where p.id = $1 and p.is_active = true
        `,
        [projectId]
      );

      const project = projectRows[0];
      if (!project) {
        return null;
      }

      const roleRows = await query<{
        id: string;
        title: string;
        description: string | null;
        min_experience: string;
        weekly_hours_min: number;
        skill_slug: string | null;
        required_level: number | null;
        weight: number | null;
      }>(
        `
        select
          pr.id,
          pr.title,
          pr.description,
          pr.min_experience::text,
          pr.weekly_hours_min,
          s.slug as skill_slug,
          prs.required_level,
          prs.weight
        from project_roles pr
        left join project_role_skills prs on prs.project_role_id = pr.id
        left join skills s on s.id = prs.skill_id
        where pr.project_id = $1 and pr.is_open = true
        order by pr.title
        `,
        [projectId]
      );

      const rolesMap = new Map<string, ProjectDetails["roles"][number]>();

      for (const row of roleRows) {
        if (!rolesMap.has(row.id)) {
          rolesMap.set(row.id, {
            id: row.id,
            title: row.title,
            description: row.description,
            min_experience: row.min_experience,
            weekly_hours_min: row.weekly_hours_min,
            required_skills: []
          });
        }

        if (row.skill_slug && row.required_level !== null && row.weight !== null) {
          rolesMap.get(row.id)?.required_skills.push({
            slug: row.skill_slug,
            required_level: row.required_level,
            weight: row.weight
          });
        }
      }

      return {
        ...project,
        roles: Array.from(rolesMap.values())
      };
    },
    projectId === demoProject.id ? demoProject : null
  );
}

export async function getMatchesByEmail(email: string): Promise<MatchItem[]> {
  return withFallback(
    "getMatchesByEmail",
    async () => {
      const rows = await query<{
        match_id: string;
        project_id: string;
        project_title: string;
        project_one_liner: string;
        role_id: string | null;
        role_title: string | null;
        score_total: number;
        score_skill: number;
        score_goal: number;
        score_availability: number;
        score_timezone: number;
        score_commitment: number;
        status: string;
        curator_note: string | null;
      }>(
        `
        select
          m.id as match_id,
          p.id as project_id,
          p.title as project_title,
          p.one_liner as project_one_liner,
          pr.id as role_id,
          pr.title as role_title,
          m.score_total,
          m.score_skill,
          m.score_goal,
          m.score_availability,
          m.score_timezone,
          m.score_commitment,
          m.status::text,
          m.curator_note
        from matches m
        join users u on u.id = m.user_id
        join projects p on p.id = m.project_id
        left join project_roles pr on pr.id = m.project_role_id
        where u.email = $1
        order by m.created_at desc
        `,
        [email]
      );

      return rows.map((row) => ({
        match_id: row.match_id,
        project: {
          id: row.project_id,
          title: row.project_title,
          one_liner: row.project_one_liner
        },
        role: {
          id: row.role_id,
          title: row.role_title
        },
        score_total: Number(row.score_total),
        score_breakdown: {
          skill: Number(row.score_skill),
          goal: Number(row.score_goal),
          availability: Number(row.score_availability),
          timezone: Number(row.score_timezone),
          commitment: Number(row.score_commitment)
        },
        status: row.status,
        curator_note: row.curator_note
      }));
    },
    fallbackMatches()
  );
}

export async function getCuratorQueue() {
  return withFallback(
    "getCuratorQueue",
    async () => {
      const counters = await query<{
        new_profiles: number;
        open_project_roles: number;
        pending_intros: number;
      }>(
        `
        select
          (select count(*)::int from users where created_at >= now() - interval '14 days') as new_profiles,
          (select count(*)::int from project_roles where is_open = true) as open_project_roles,
          (select count(*)::int from intros where status = 'pending') as pending_intros
        `
      );

      const suggestions = await query<{
        user_id: string;
        project_role_id: string | null;
        score_total: number;
        reason: string[];
      }>(
        `
        select
          m.user_id,
          m.project_role_id,
          m.score_total,
          array[
            'Skill fit ' || m.score_skill::text,
            'Timezone fit ' || m.score_timezone::text,
            'Availability fit ' || m.score_availability::text
          ] as reason
        from matches m
        where m.status = 'suggested'
        order by m.score_total desc
        limit 20
        `
      );

      return {
        ...counters[0],
        suggestions
      };
    },
    {
      new_profiles: 2,
      open_project_roles: 1,
      pending_intros: 1,
      suggestions: [
        {
          user_id: "demo-user-1",
          project_role_id: "demo-role-1",
          score_total: 82.5,
          reason: ["React fit", "Timezone overlap", "Good sprint availability"]
        }
      ]
    }
  );
}

export async function getHostJoinRequests(filters?: {
  status?: "pending" | "approved" | "rejected";
  q?: string;
}): Promise<JoinRequestItem[]> {
  return withFallback(
    "getHostJoinRequests",
    async () => {
      const params: unknown[] = [];
      const whereParts: string[] = [];

      if (filters?.status) {
        params.push(filters.status);
        whereParts.push(`jr.status = $${params.length}::join_request_status`);
      }

      if (filters?.q?.trim()) {
        params.push(`%${filters.q.trim()}%`);
        whereParts.push(
          `(jr.applicant_name ilike $${params.length} or jr.applicant_email ilike $${params.length} or p.title ilike $${params.length})`
        );
      }

      const whereSql = whereParts.length > 0 ? `where ${whereParts.join(" and ")}` : "";

      const rows = await query<JoinRequestItem>(
        `
        select
          jr.id,
          jr.project_id,
          p.title as project_title,
          jr.role_id,
          pr.title as role_title,
          jr.applicant_email,
          jr.applicant_name,
          jr.motivation,
          jr.hours_per_week,
          jr.status::text,
          jr.created_at::text
        from project_join_requests jr
        join projects p on p.id = jr.project_id
        left join project_roles pr on pr.id = jr.role_id
        ${whereSql}
        order by
          case jr.status
            when 'pending' then 0
            when 'approved' then 1
            else 2
          end,
          jr.created_at desc
        limit 100
        `,
        params
      );

      return rows;
    },
    fallbackJoinRequests()
  );
}
