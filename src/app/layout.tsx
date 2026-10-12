import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { api } from "@/lib/api";
import { palette } from "@/lib/design/tokens";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  // Demonstration data must not be indexed as if it were real inventory.
  robots: api.isDemo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: palette.champagne,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
