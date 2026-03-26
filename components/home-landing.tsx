"use client";

import { useState } from "react";
import Link from "next/link";
import { FormatPicker } from "@/components/format-picker";
import { WaitlistForm } from "@/components/waitlist-form";
import type { ProjectCard, PublicStats } from "@/lib/types";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography
} from "@mui/material";

export function HomeLanding({
  stats,
  projects
}: {
  stats: PublicStats;
  projects: ProjectCard[];
}) {
  const highlights = ["React", "Next.js", "TypeScript", "Node.js", "AI side-projects"];
  const [joinOpen, setJoinOpen] = useState(false);

  return (
    <Stack spacing={2}>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          background:
            "radial-gradient(circle at 82% 20%, rgba(15,118,110,0.14), rgba(15,118,110,0)), #fffdf9"
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Box flex={1.4}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#0f5d57", letterSpacing: ".06em" }}>
              PRACTICE NETWORK FOR BUILDERS
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, fontFamily: "var(--font-display)", lineHeight: 1.07 }}>
              Build together, ship demos fast, grow your coding confidence
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              Join short, cozy project sprints with developers who actually want to practice,
              collaborate, and finish something real in 2-4 weeks.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
              <Button variant="contained" onClick={() => setJoinOpen(true)}>
                Join builders circle
              </Button>
              <Button variant="outlined" component={Link} href="/projects">
                Explore live projects
              </Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
              {highlights.map((item) => (
                <Chip key={item} label={item} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>

          <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6" fontFamily="var(--font-display)">
              What happens in week 1
            </Typography>
            <Box component="ol" sx={{ pl: 2.5, m: 0, color: "text.secondary", display: "grid", gap: 0.5, mt: 1 }}>
              <li>You join and set your weekly hours</li>
              <li>You pick sprint format and preferred role</li>
              <li>You get 3 team suggestions</li>
              <li>You join one project and start building</li>
            </Box>
            <Button variant="contained" onClick={() => setJoinOpen(true)} sx={{ mt: 1.5 }}>
              Start now
            </Button>
          </Paper>
        </Stack>
      </Paper>

      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <StatCard value={stats.active_project_requests} label="active practice projects" />
        <StatCard value={stats.builders_in_pipeline} label="builders in the circle" />
        <StatCard value={stats.intros_last_14_days} label="team intros in last 14 days" />
      </Stack>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography color="text.secondary">Built for focused builders:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
          {["Structured sprints", "Small teams", "Weekly check-ins", "Demo at finish"].map((item) => (
            <Chip key={item} label={item} size="small" variant="outlined" />
          ))}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ mb: 1, fontFamily: "var(--font-display)" }}>
          Let&apos;s build our own network
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          Most developer social apps are noisy and not focused on actually shipping together.
          PeoplesNetwork is our attempt to build a better one, in public, with the community.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip size="small" label="Less scrolling" variant="outlined" />
          <Chip size="small" label="More building" variant="outlined" />
          <Chip size="small" label="Small teams" variant="outlined" />
          <Chip size="small" label="Real demos" variant="outlined" />
        </Stack>
      </Paper>

      <Box>
        <Typography variant="h4" sx={{ mb: 1, fontFamily: "var(--font-display)" }}>
          How it works
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.25}>
          <InfoCard title="1. Pick your format" text="Choose 2-week sprint, 4-week squad, or feedback circle." />
          <InfoCard title="2. Match with intent" text="We suggest teammates by stack, timezone, and commitment level." />
          <InfoCard title="3. Ship and reflect" text="Finish with a demo, clean repo, and lessons learned with your team." />
        </Stack>
      </Box>

      <FormatPicker />

      <Box>
        <Typography variant="h4" sx={{ mb: 1, fontFamily: "var(--font-display)" }}>
          Live practice briefs
        </Typography>
        <Stack spacing={1.25}>
          {projects.slice(0, 3).map((project) => (
            <Paper key={project.id} variant="outlined" sx={{ p: 2 }}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1}>
                <Box>
                  <Typography variant="h6">{project.title}</Typography>
                  <Typography color="text.secondary">{project.one_liner}</Typography>
                </Box>
                <Button component={Link} href={`/projects/${project.id}`} variant="outlined" size="small">
                  View brief
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                <Chip size="small" label={project.stage} variant="outlined" />
                <Chip size="small" label={project.collaboration} variant="outlined" />
                <Chip size="small" label={`${project.weekly_hours_expected}h/week`} variant="outlined" />
                {project.top_skills.map((skill) => (
                  <Chip key={`${project.id}-${skill}`} size="small" label={skill} variant="outlined" />
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ mb: 1, fontFamily: "var(--font-display)" }}>
          What builders say
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <Quote text="I finally stopped coding alone. We shipped a small product in 3 weeks." author="Anna, frontend developer" />
          <Quote text="Perfect balance between chill and structured. Weekly rhythm kept us focused." author="Mark, fullstack engineer" />
          <Quote text="Great place to practice real collaboration before joining bigger product teams." author="Eva, junior developer" />
        </Stack>
      </Paper>

      <Paper variant="outlined" id="join" sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ mb: 0.5, fontFamily: "var(--font-display)" }}>
          Join the next wave
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1.25 }}>
          Fill this once. We will propose team options that match your stack and weekly capacity.
        </Typography>
        <WaitlistForm />
      </Paper>

      <Dialog open={joinOpen} onClose={() => setJoinOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Join builders circle</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 1.5 }}>
            Fill this once. We will propose team options that match your stack and weekly capacity.
          </Typography>
          <WaitlistForm
            submitLabel="Send join request"
            onSubmitted={() => {
              setTimeout(() => setJoinOpen(false), 1200);
            }}
          />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
      <Typography variant="h4" fontFamily="var(--font-display)">
        {value}
      </Typography>
      <Typography color="text.secondary">{label}</Typography>
    </Paper>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{text}</Typography>
    </Paper>
  );
}

function Quote({ text, author }: { text: string; author: string }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ mb: 0.5 }}>"{text}"</Typography>
      <Typography variant="caption" color="text.secondary">
        {author}
      </Typography>
    </Box>
  );
}
