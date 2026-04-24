"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Github } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  // const isActive = (path: string) => pathname === path;
  const isStartsWith = (path: string) => pathname?.startsWith(path);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-card/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-black tracking-widest text-foreground hover:opacity-90 transition-opacity"
        >
          OKOJIN
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/articles"
            className={`px-3 py-2 font-bold text-xs tracking-widest transition-colors ${
              isStartsWith("/articles")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ARTICLES
          </Link>

          <Link
            href="/algorithm"
            className={`px-3 py-2 text-xs font-bold tracking-widest transition-colors ${
              isStartsWith("/algorithm")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ALGORITHMS
          </Link>

          {/* <Link
            href="/about"
            className={`px-3 py-2 text-xs font-bold tracking-widest transition-colors ${isActive("/about")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            ABOUT
          </Link> */}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Jinoko01"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
