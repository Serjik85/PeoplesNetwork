import { getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <h1 className="section-title">Active practice projects</h1>
      <p className="muted">
        Small, friendly projects for 2-4 week sprints. Designed for learning and shipping together.
      </p>

      <div className="cards">
        {projects.map((project) => (
          <article key={project.id} className="card">
            <div className="row">
              <div>
                <h3>{project.title}</h3>
                <p className="muted">{project.one_liner}</p>
              </div>
              <a className="btn secondary" href={`/projects/${project.id}`}>
                View brief
              </a>
            </div>
            <div className="chips">
              <span className="chip">{project.domain}</span>
              <span className="chip">{project.stage}</span>
              <span className="chip">{project.weekly_hours_expected}h/week</span>
              <span className="chip">{project.timezone_preference ?? "Any timezone"}</span>
              {project.top_skills.map((skill) => (
                <span className="chip" key={`${project.id}-${skill}`}>
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
