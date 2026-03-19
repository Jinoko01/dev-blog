import type { Metadata } from "next";
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
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen flex font-sans">
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6 border-b border-gray-200">
            <h1 className="font-bold text-xl tracking-tight">
              DevArchive Admin
            </h1>
          </div>
          <nav className="p-4 flex flex-col gap-2">
            <a
              href="/"
              className="px-4 py-2 bg-gray-100 rounded-md font-medium text-blue-600"
            >
              Dashboard
            </a>
            <a
              href="/posts"
              className="px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700 transition"
            >
              Posts
            </a>
            <a
              href="/settings"
              className="px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700 transition"
            >
              Settings
            </a>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
