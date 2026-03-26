"use client";

import Link from "next/link";
import { JoinRequestActions } from "@/components/join-request-actions";
import type { JoinRequestItem } from "@/lib/types";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";

const statusTabs: Array<{ key?: "pending" | "approved" | "rejected"; label: string }> = [
  { key: undefined, label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" }
];

export function DashboardHostBoard({
  joinRequests,
  statusParam,
  qParam
}: {
  joinRequests: JoinRequestItem[];
  statusParam?: "pending" | "approved" | "rejected";
  qParam?: string;
}) {
  return (
    <Stack spacing={2}>
      <Typography variant="h3" fontFamily="var(--font-display)">
        Host board
      </Typography>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          mb={2}
        >
          <Typography variant="h5">Join requests</Typography>
          <Chip label={`${joinRequests.length} shown`} size="small" />
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={2}>
          {statusTabs.map((tab) => {
            const isActive = (tab.key ?? "") === (statusParam ?? "");
            const href =
              tab.key === undefined
                ? `/dashboard${qParam ? `?q=${encodeURIComponent(qParam)}` : ""}`
                : `/dashboard?status=${tab.key}${qParam ? `&q=${encodeURIComponent(qParam)}` : ""}`;

            return (
              <Button
                key={tab.label}
                component={Link}
                href={href}
                size="small"
                variant={isActive ? "contained" : "outlined"}
              >
                {tab.label}
              </Button>
            );
          })}
        </Stack>

        <Box component="form" method="get" sx={{ display: "grid", gap: 1.25, mb: 2 }}>
          <input type="hidden" name="status" value={statusParam ?? ""} />
          <TextField
            name="q"
            defaultValue={qParam ?? ""}
            size="small"
            placeholder="Search and press Enter"
            fullWidth
          />
          {qParam ? (
            <Button
              component={Link}
              href={statusParam ? `/dashboard?status=${statusParam}` : "/dashboard"}
              variant="outlined"
              size="small"
              sx={{ justifySelf: "start" }}
            >
              Clear search
            </Button>
          ) : null}
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Applicant</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Slot</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Motivation</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {joinRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Typography variant="body2">{request.applicant_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.applicant_email}
                    </Typography>
                  </TableCell>
                  <TableCell>{request.project_title}</TableCell>
                  <TableCell>{request.role_title ?? "Any slot"}</TableCell>
                  <TableCell>{request.hours_per_week}h/week</TableCell>
                  <TableCell sx={{ maxWidth: 380 }}>{request.motivation}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={request.status}
                      color={
                        request.status === "approved"
                          ? "success"
                          : request.status === "rejected"
                            ? "error"
                            : "default"
                      }
                      variant={request.status === "pending" ? "outlined" : "filled"}
                    />
                  </TableCell>
                  <TableCell>
                    <JoinRequestActions requestId={request.id} currentStatus={request.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}

