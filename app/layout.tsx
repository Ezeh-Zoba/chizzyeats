import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chizzy's Eats",
  description:
    "A Nigerian kitchen, global table. Cooking the world from home, by Chizzy — restaurant-worthy recipes made at home, no passport or reservation needed.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
