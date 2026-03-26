"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#295a56"
    },
    secondary: {
      main: "#6f7c79"
    },
    background: {
      default: "#f6f6f3",
      paper: "#ffffff"
    },
    text: {
      primary: "#1f2a2a",
      secondary: "#66716d"
    }
  },
  shape: {
    borderRadius: 10
  },
  typography: {
    fontFamily:
      "var(--font-body), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderColor: "#dde2de"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    }
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
