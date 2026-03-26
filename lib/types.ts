export type PublicStats = {
  active_project_requests: number;
  builders_in_pipeline: number;
  intros_last_14_days: number;
};

export type ProjectCard = {
  id: string;
  title: string;
  one_liner: string;
  stage: string;
  domain: string;
  weekly_hours_expected: number;
  collaboration: string;
  timezone_preference: string | null;
  top_skills: string[];
};

export type ProjectRole = {
  id: string;
  title: string;
  description: string | null;
  min_experience: string;
  weekly_hours_min: number;
  required_skills: { slug: string; required_level: number; weight: number }[];
};

export type ProjectDetails = {
  id: string;
  title: string;
  one_liner: string;
  description: string;
  stage: string;
  domain: string;
  target_market: string | null;
  weekly_hours_expected: number;
  collaboration: string;
  timezone_preference: string | null;
  roles: ProjectRole[];
};

export type MatchItem = {
  match_id: string;
  project: {
    id: string;
    title: string;
    one_liner: string;
  };
  role: {
    id: string | null;
    title: string | null;
  };
  score_total: number;
  score_breakdown: {
    skill: number;
    goal: number;
    availability: number;
    timezone: number;
    commitment: number;
  };
  status: string;
  curator_note: string | null;
};

export type JoinRequestItem = {
  id: string;
  project_id: string;
  project_title: string;
  role_id: string | null;
  role_title: string | null;
  applicant_email: string;
  applicant_name: string;
  motivation: string;
  hours_per_week: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};
