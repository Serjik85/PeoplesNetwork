"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f766e"
    },
    background: {
      default: "#f3efe6",
      paper: "#fffdf9"
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily:
      "var(--font-body), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
  }
});

export function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

