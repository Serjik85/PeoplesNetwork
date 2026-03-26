"use client";

import { useMemo, useState } from "react";

type Track = "sprint" | "ship" | "support";

const trackMeta: Record<
  Track,
  {
    title: string;
    details: string;
    suggestions: string[];
  }
> = {
  sprint: {
    title: "2-week Sprint Buddy",
    details: "Pair programming + one demo day. Perfect when you want practice momentum.",
    suggestions: [
      "Frontend pair for a mini-kanban app",
      "Node.js teammate for API practice",
      "React buddy for testing and refactor sprint"
    ]
  },
  ship: {
    title: "4-week Ship Squad",
    details: "Team of 3-4 builders with a weekly check-in and final showcase.",
    suggestions: [
      "Small SaaS dashboard team",
      "AI side-project squad with weekly milestones",
      "Build-in-public product challenge group"
    ]
  },
  support: {
    title: "Feedback Circle",
    details: "Ship your own project but get regular code reviews and accountability.",
    suggestions: [
      "Weekly review pod for portfolio projects",
      "Architecture feedback from fullstack peers",
      "Async progress check-ins with senior builders"
    ]
  }
};

export function FormatPicker() {
  const [track, setTrack] = useState<Track>("sprint");
  const meta = useMemo(() => trackMeta[track], [track]);

  return (
    <section className="journey card">
      <h2 className="section-title">Your first 60 seconds</h2>
      <p className="muted">Join, pick your format, get 3 team suggestions.</p>

      <div className="journey-steps">
        <div className="journey-step is-active">
          <span>1</span>
          <p>Join the builders circle</p>
        </div>
        <div className="journey-step is-active">
          <span>2</span>
          <p>Pick how you want to collaborate</p>
        </div>
        <div className="journey-step is-active">
          <span>3</span>
          <p>Receive 3 relevant team options</p>
        </div>
      </div>

      <div className="track-tabs">
        <button
          className={`track-tab ${track === "sprint" ? "active" : ""}`}
          onClick={() => setTrack("sprint")}
          type="button"
        >
          2-week Sprint
        </button>
        <button
          className={`track-tab ${track === "ship" ? "active" : ""}`}
          onClick={() => setTrack("ship")}
          type="button"
        >
          4-week Ship Squad
        </button>
        <button
          className={`track-tab ${track === "support" ? "active" : ""}`}
          onClick={() => setTrack("support")}
          type="button"
        >
          Feedback Circle
        </button>
      </div>

      <div className="track-preview">
        <h3>{meta.title}</h3>
        <p className="muted">{meta.details}</p>
        <ul className="suggestions">
          {meta.suggestions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

