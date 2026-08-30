import type { Metadata } from "next";
import { Suspense } from "react";
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
    <html lang="ko" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen flex text-[color:var(--color-foreground)]">
        <Suspense
          fallback={
            <p role="status" className="p-8 text-sm text-muted-foreground">
              관리자 화면을 불러오는 중입니다.
            </p>
          }
        >
          <AdminShell>{children}</AdminShell>
        </Suspense>
      </body>
    </html>
  );
}
