"use client";

import { useState } from "react";

export function MatchActions({ matchId }: { matchId: string }) {
  const [state, setState] = useState("");

  async function submit(action: "accept" | "reject") {
    setState("Saving...");
    const response = await fetch(`/api/matches/${matchId}/${action}`, {
      method: "POST"
    });

    if (!response.ok) {
      setState("Failed. Try again.");
      return;
    }

    const payload = (await response.json()) as { status: string };
    setState(`Updated: ${payload.status}`);
  }

  return (
    <div className="actions">
      <button className="btn" onClick={() => submit("accept")} type="button">
        Join this team
      </button>
      <button className="btn danger" onClick={() => submit("reject")} type="button">
        Skip
      </button>
      {state ? <small className="muted">{state}</small> : null}
    </div>
  );
}
