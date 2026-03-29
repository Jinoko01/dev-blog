"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Github } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const isStartsWith = (path: string) => pathname?.startsWith(path);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-card/80 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-black tracking-widest text-[color:var(--color-primary)] hover:opacity-90 transition-opacity"
        >
          DEVELOPER BLOG
        </Link>

        <nav className="hidden sm:flex items-center gap-2">
          <Link
            href="/"
            className={`relative px-3 py-2 font-bold text-sm tracking-widest transition-colors ${
              isActive("/")
                ? "text-[color:var(--color-primary)]"
                : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
            }`}
          >
            HOME
            {isActive("/") && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[color:var(--color-primary)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          <Link
            href="/algorithm"
            className={`relative px-3 py-2 text-sm font-bold tracking-widest transition-colors ${
              isStartsWith("/algorithm")
                ? "text-[color:var(--color-primary)]"
                : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
            }`}
          >
            ALGORITHM
            {isStartsWith("/algorithm") && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[color:var(--color-primary)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          <Link
            href="/about"
            className={`relative px-3 py-2 text-sm font-bold tracking-widest transition-colors ${
              isActive("/about")
                ? "text-[color:var(--color-primary)]"
                : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
            }`}
          >
            ABOUT
            {isActive("/about") && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[color:var(--color-primary)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          <Link
            href="/guestbook"
            className={`relative px-3 py-2 text-sm font-bold tracking-widest transition-colors ${
              isActive("/guestbook")
                ? "text-[color:var(--color-primary)]"
                : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
            }`}
          >
            GUESTBOOK
            {isActive("/guestbook") && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[color:var(--color-primary)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <motion.a
            href="https://github.com/Jinoko01"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </motion.a>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
