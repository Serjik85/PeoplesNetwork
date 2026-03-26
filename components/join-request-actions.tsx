"use client";

import { Button, Chip, Stack, Typography } from "@mui/material";
import { useState } from "react";

export function JoinRequestActions({
  requestId,
  currentStatus
}: {
  requestId: string;
  currentStatus: "pending" | "approved" | "rejected";
}) {
  const [status, setStatus] = useState(currentStatus);
  const [info, setInfo] = useState("");

  async function submit(action: "approve" | "reject") {
    setInfo("Saving...");
    const response = await fetch(`/api/host/join-requests/${requestId}/${action}`, {
      method: "POST"
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      setInfo(payload.message ?? "Failed to save.");
      return;
    }

    const payload = (await response.json()) as { status?: "approved" | "rejected"; demo?: boolean };
    if (payload.status) {
      setStatus(payload.status);
    }
    setInfo(payload.demo ? "Saved in demo mode." : "Updated.");
  }

  if (status !== "pending") {
    return (
      <Chip
        color={status === "approved" ? "success" : "error"}
        label={status}
        size="small"
        variant="outlined"
      />
    );
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
      <Button variant="contained" size="small" onClick={() => submit("approve")} type="button">
        Approve
      </Button>
      <Button variant="outlined" size="small" onClick={() => submit("reject")} type="button">
        Decline
      </Button>
      {info ? (
        <Typography variant="caption" color="text.secondary">
          {info}
        </Typography>
      ) : null}
    </Stack>
  );
}
