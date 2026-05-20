import type { Metadata } from "next";
import AdminShell from "@/components/AdminShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "DevArchive Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex text-[color:var(--color-foreground)]">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
