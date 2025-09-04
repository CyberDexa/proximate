import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ProxiMeet - Find your vibe. Meet tonight.",
  description: "Safe, consensual connections for adults seeking casual encounters. 18+ only.",
  keywords: ["dating", "hookup", "casual", "adults", "18+", "meetup", "safety"],
  robots: "noindex, nofollow", // Adult content, restrict search indexing
  other: {
    "age-gate": "18+",
    "content-rating": "adult"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
