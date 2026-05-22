"use client";

import { Star } from "lucide-react";
import { useInViewOnce } from "./reveal-wrap";

const ITEMS = [
  { text: "Frontend Architecture" },
  { text: "Design Systems" },
  { text: "Type-Safe by Default" },
  { text: "Pixel Perfect" },
  { text: "Built for Humans" },
  { text: "Seoul · Remote" },
];

const ALL = [...ITEMS, ...ITEMS];

export function LandingMarquee() {
  const [marqueeRef, isInView] = useInViewOnce<HTMLDivElement>({
    rootMargin: "0px",
    threshold: 0.05,
  });

  return (
    <div
      ref={marqueeRef}
      className="relative w-full overflow-hidden border-t border-b border-border bg-foreground text-background dark:bg-[#f97316] dark:text-black"
      style={{ "--marquee-duration": "28s" } as React.CSSProperties}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-foreground to-transparent dark:from-[#f97316]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-foreground to-transparent dark:from-[#f97316]" />
      <div
        className={`marquee-track flex w-max motion-reduce:[animation:none]${isInView ? " is-running" : ""}`}
      >
        {ALL.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-12 whitespace-nowrap px-6 py-[22px] text-[clamp(20px,2.6vw,32px)] font-black uppercase tracking-[-0.01em]"
          >
            <span>{item.text}</span>
            <Star size={18} className="shrink-0 text-primary dark:text-black" />
          </div>
        ))}
      </div>
    </div>
  );
}
