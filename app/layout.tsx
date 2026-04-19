import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoCA Cognitive Screening Exercise",
  description: "A free educational MoCA-style cognitive screening exercise. Not a diagnostic tool. Includes links to alz.org and mocatest.org.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
