"use client";

import { clsx } from "clsx";
import { type MouseEvent, useEffect, useState } from "react";

const HEADING_SELECTOR = "h1[id], h2[id], h3[id], h4[id]";
const SCROLL_OFFSET = 100;

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentId: string;
}

function scrollToHeading(
  event: MouseEvent<HTMLAnchorElement>,
  headingId: string,
) {
  event.preventDefault();

  const target = document.getElementById(headingId);
  if (!target) {
    return;
  }

  const top =
    target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
  window.history.pushState(null, "", `#${headingId}`);
}

export function TableOfContents({ contentId }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (!content) {
      return;
    }

    let intersectionObserver: IntersectionObserver | undefined;

    const updateHeadings = () => {
      const elements = Array.from(
        content.querySelectorAll<HTMLElement>(HEADING_SELECTOR),
      );
      const nextHeadings = elements.map((element) => ({
        id: element.id,
        text: element.textContent ?? "",
        level: Number(element.tagName.slice(1)),
      }));

      setHeadings(nextHeadings);
      setActiveId((currentId) => {
        const currentHeadingStillExists = nextHeadings.some(
          ({ id }) => id === currentId,
        );
        return currentHeadingStillExists
          ? currentId
          : (nextHeadings[0]?.id ?? "");
      });

      intersectionObserver?.disconnect();
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const visibleHeading = entries.find((entry) => entry.isIntersecting);
          if (visibleHeading) {
            setActiveId(visibleHeading.target.id);
          }
        },
        { rootMargin: "-100px 0px -60% 0px", threshold: 1 },
      );
      elements.forEach((element) => intersectionObserver?.observe(element));
    };

    updateHeadings();

    const mutationObserver = new MutationObserver(updateHeadings);
    mutationObserver.observe(content, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver?.disconnect();
    };
  }, [contentId]);

  if (headings.length === 0) {
    return null;
  }

  const minLevel = Math.min(...headings.map(({ level }) => level));

  return (
    <nav
      aria-label="목차"
      className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-6 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 shadow-sm transition-colors scrollbar-thin"
    >
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
              aria-current={activeId === heading.id ? "location" : undefined}
              onClick={(event) => scrollToHeading(event, heading.id)}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
