import type { Metadata } from "next";
import { MuiProvider } from "@/components/mui-provider";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Peoples Network",
  description: "A cozy community for building and practicing coding together"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        <MuiProvider>
          <header className="shell topbar">
            <a href="/" className="brand">
              PeoplesNetwork
            </a>
            <nav className="topnav">
              <a href="/projects">Practice Projects</a>
              <a href="/matches">My Team Picks</a>
              <a href="/dashboard">Host Board</a>
            </nav>
          </header>
          <main className="shell">{children}</main>
        </MuiProvider>
      </body>
    </html>
  );
}
