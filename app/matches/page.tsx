import { MatchActions } from "@/components/match-actions";
import { getMatchesByEmail } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const email = process.env.DEMO_USER_EMAIL ?? "anna@example.com";
  const matches = await getMatchesByEmail(email);

  return (
    <div>
      <h1 className="section-title">My team picks</h1>
      <p className="muted">Demo user: {email}</p>

      <div className="cards">
        {matches.map((match) => (
          <article className="card" key={match.match_id}>
            <div className="row">
              <div>
                <h3>{match.project.title}</h3>
                <p className="muted">{match.project.one_liner}</p>
              </div>
              <span className="chip">{match.status}</span>
            </div>
            <div className="chips">
              <span className="chip">Team slot: {match.role.title ?? "Any"}</span>
              <span className="chip">Score: {match.score_total.toFixed(1)}</span>
              <span className="chip">Skill: {match.score_breakdown.skill}</span>
              <span className="chip">Goal: {match.score_breakdown.goal}</span>
              <span className="chip">Availability: {match.score_breakdown.availability}</span>
              <span className="chip">Timezone: {match.score_breakdown.timezone}</span>
              <span className="chip">Commitment: {match.score_breakdown.commitment}</span>
            </div>
            {match.curator_note ? <p className="muted">{match.curator_note}</p> : null}
            <MatchActions matchId={match.match_id} />
          </article>
        ))}
      </div>
    </div>
  );
}
