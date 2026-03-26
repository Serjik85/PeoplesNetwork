"use client";

import { useState } from "react";

type FormState = {
  email: string;
  full_name: string;
  role: "builder" | "project_owner" | "both";
  stack: string;
  weekly_hours: number;
  timezone: string;
};

const initialState: FormState = {
  email: "",
  full_name: "",
  role: "builder",
  stack: "react,nextjs,typescript",
  weekly_hours: 10,
  timezone: "Europe/Copenhagen"
};

export function WaitlistForm() {
  const [data, setData] = useState<FormState>(initialState);
  const [status, setStatus] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Sending...");

    const payload = {
      ...data,
      stack: data.stack
        .split(",")
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean)
    };

    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setStatus("Could not submit. Check fields and try again.");
      return;
    }

    setStatus("Done. You are in. We will suggest team options soon.");
    setData(initialState);
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label className="form-label mb-1">Email</label>
      <input
        className="field"
        type="email"
        placeholder="you@example.com"
        value={data.email}
        onChange={(e) => setData((s) => ({ ...s, email: e.target.value }))}
        required
      />

      <label className="form-label mb-1">Name</label>
      <input
        className="field"
        type="text"
        placeholder="Your name"
        value={data.full_name}
        onChange={(e) => setData((s) => ({ ...s, full_name: e.target.value }))}
        required
      />

      <label className="form-label mb-1">What do you want to do?</label>
      <select
        className="field"
        value={data.role}
        onChange={(e) =>
          setData((s) => ({ ...s, role: e.target.value as FormState["role"] }))
        }
      >
        <option value="builder">I want to join projects</option>
        <option value="project_owner">I want to host a project</option>
        <option value="both">Both</option>
      </select>

      <label className="form-label mb-1">Main stack</label>
      <input
        className="field"
        type="text"
        placeholder="react,nextjs,typescript"
        value={data.stack}
        onChange={(e) => setData((s) => ({ ...s, stack: e.target.value }))}
      />

      <label className="form-label mb-1">Weekly time commitment (hours/week)</label>
      <input
        className="field"
        type="number"
        min={1}
        max={80}
        value={data.weekly_hours}
        onChange={(e) => setData((s) => ({ ...s, weekly_hours: Number(e.target.value) }))}
      />
      <small className="muted">Example: 10 means you can spend around 10 hours each week.</small>

      <label className="form-label mb-1">Timezone</label>
      <input
        className="field"
        type="text"
        placeholder="Europe/Copenhagen"
        value={data.timezone}
        onChange={(e) => setData((s) => ({ ...s, timezone: e.target.value }))}
      />
      <button className="btn" type="submit">
        Join builders circle
      </button>
      {status ? <small className="muted">{status}</small> : null}
    </form>
  );
}
