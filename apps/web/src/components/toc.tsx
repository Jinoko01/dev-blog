"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll(".prose h1, .prose h2, .prose h3, .prose h4"),
    );

    const headingData = elements.map((elem) => ({
      id: elem.id,
      text: elem.textContent || "",
      level: Number(elem.tagName.charAt(1)),
    }));

    setHeadings(headingData);

    if (elements.length > 0) {
      setActiveId(elements[0].id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 1.0 },
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) {
    return null;
  }

  // Find the minimum heading level to calculate indentation properly
  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-6 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 shadow-sm transition-colors scrollbar-thin">
      <h3 className="font-display font-bold text-lg tracking-wide text-foreground mb-5">
        목차
      </h3>
      <ul className="flex flex-col gap-3 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - minLevel) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={clsx(
                "block transition-colors line-clamp-2 hover:text-foreground",
                activeId === heading.id
                  ? "text-brand-500 font-semibold"
                  : "text-foreground/60",
              )}
              onClick={(e) => {
                e.preventDefault();
                const target = document.querySelector(`#${heading.id}`);
                if (target) {
                  const y =
                    target.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: "smooth" });
                  history.pushState(null, "", `#${heading.id}`);
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
