import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Archive | Portfolio",
  description: "개발자의 기록과 아카이브",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${outfit.variable} antialiased min-h-screen font-body transition-colors duration-500`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1 w-full flex flex-col items-center">
            <div className="w-full max-w-7xl">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
