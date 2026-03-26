import { notFound } from "next/navigation";
import { JoinRequestForm } from "@/components/join-request-form";
import { getProjectById } from "@/lib/queries";

type Params = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProjectDetailsPage({ params }: Params) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const roleOptions = project.roles.map((role) => ({
    id: role.id,
    title: role.title
  }));

  return (
    <div className="stack">
      <div className="card">
        <h1>{project.title}</h1>
        <p className="muted">{project.one_liner}</p>
        <p>{project.description}</p>
        <div className="chips">
          <span className="chip">{project.stage}</span>
          <span className="chip">{project.domain}</span>
          <span className="chip">{project.weekly_hours_expected}h/week</span>
          <span className="chip">{project.timezone_preference ?? "Any timezone"}</span>
        </div>
      </div>

      <section className="card">
        <h2>Project brief</h2>
        <div className="brief-grid">
          <div>
            <h3>What we are building</h3>
            <p className="muted">
              Small practical product with clear weekly milestones, pair-programming sessions, and
              one final demo.
            </p>
          </div>
          <div>
            <h3>How this team works</h3>
            <p className="muted">
              2-4 builders, async updates during week, one live session, and a lightweight retro at
              the end.
            </p>
          </div>
          <div>
            <h3>Success for this sprint</h3>
            <p className="muted">
              Live demo + clean GitHub repo + notes on what each teammate learned.
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Open team slots</h2>
        <div className="cards">
          {project.roles.map((role) => (
            <article className="card" key={role.id}>
              <h3>{role.title}</h3>
              <p className="muted">{role.description}</p>
              <div className="chips">
                <span className="chip">level: {role.min_experience}+</span>
                <span className="chip">{role.weekly_hours_min}h/week minimum</span>
              </div>
              <div className="chips">
                {role.required_skills.map((skill) => (
                  <span className="chip" key={`${role.id}-${skill.slug}`}>
                    {skill.slug} L{skill.required_level}
                  </span>
                ))}
              </div>
              <div className="actions">
                <a className="btn" href="#join-request">
                  Join request
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="join-request" className="card">
        <h2>Join request</h2>
        <p className="muted">
          Share why you want to join this sprint. Host reviews requests and sends team intros.
        </p>
        <JoinRequestForm projectId={project.id} roleOptions={roleOptions} />
      </section>
    </div>
  );
}

