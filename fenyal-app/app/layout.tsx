import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fenyal · فنيال — On the belt",
  description: "Fenyal's dishes on a turning conveyor belt: a concept built by Sponsify.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
