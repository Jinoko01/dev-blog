"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Terminal } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "HOME",
      icon: Home,
      href: "/",
      isActive: pathname === "/",
    },
    {
      label: "ARTICLES",
      icon: FileText,
      href: "/articles",
      isActive: pathname?.startsWith("/articles"),
    },
    {
      label: "ALGORITHMS",
      icon: Terminal,
      href: "/algorithm",
      isActive: pathname?.startsWith("/algorithm"),
    },
    // {
    //   label: "ABOUT",
    //   icon: User,
    //   href: "/about",
    //   isActive: pathname === "/about",
    // },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border pb-safe">
      <ul className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  item.isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${item.isActive ? "stroke-[2.5px]" : "stroke-2"}`}
                />
                <span className="text-[10px] font-bold tracking-widest">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
