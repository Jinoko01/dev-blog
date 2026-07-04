import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import AdminShell from "@/components/AdminShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin Console — OKOJIN.LOG",
  description: "OKOJIN.LOG Admin Console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased min-h-screen flex text-[color:var(--color-foreground)]">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
