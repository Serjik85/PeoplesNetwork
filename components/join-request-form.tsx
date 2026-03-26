"use client";

import { useState } from "react";

type Props = {
  projectId: string;
  roleOptions: { id: string; title: string }[];
};

export function JoinRequestForm({ projectId, roleOptions }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState(roleOptions[0]?.id ?? "");
  const [motivation, setMotivation] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [status, setStatus] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Sending request...");

    const response = await fetch(`/api/projects/${projectId}/join`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        full_name: name,
        role_id: roleId || null,
        motivation,
        hours_per_week: hoursPerWeek
      })
    });

    if (!response.ok) {
      setStatus("Could not submit request. Please try again.");
      return;
    }

    const payload = (await response.json()) as { demo?: boolean };
    setStatus(
      payload.demo
        ? "Saved in demo mode. Start database to store real join requests."
        : "Request sent. Host will review your join request soon."
    );
    setEmail("");
    setName("");
    setMotivation("");
    setHoursPerWeek(8);
  }

  return (
    <form className="form join-form" onSubmit={onSubmit}>
      <div className="join-grid">
        <input
          className="field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="field"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <select
        className="field"
        value={roleId}
        onChange={(e) => setRoleId(e.target.value)}
        disabled={roleOptions.length === 0}
      >
        {roleOptions.length === 0 ? (
          <option value="">No open slots</option>
        ) : (
          roleOptions.map((role) => (
            <option key={role.id} value={role.id}>
              {role.title}
            </option>
          ))
        )}
      </select>

      <textarea
        className="field textarea"
        placeholder="Why do you want to join this sprint?"
        value={motivation}
        onChange={(e) => setMotivation(e.target.value)}
        minLength={20}
        required
      />

      <input
        className="field"
        type="number"
        min={1}
        max={40}
        value={hoursPerWeek}
        onChange={(e) => setHoursPerWeek(Number(e.target.value))}
        required
      />

      <button className="btn" type="submit" disabled={roleOptions.length === 0}>
        Send join request
      </button>
      {status ? <small className="muted">{status}</small> : null}
    </form>
  );
}

