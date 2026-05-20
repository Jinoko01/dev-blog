"use client";

import { AboutSection } from "@/components/landing/about-section";
import { CompetenciesSection } from "@/components/landing/competencies-section";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingMarquee } from "@/components/landing/landing-marquee";
import { LatestSection } from "@/components/landing/latest-section";
import { TechStackSection } from "@/components/landing/tech-stack-section";
import { recordVisit } from "@/lib/api";
import type { PostMetadata } from "@/lib/mdx";
import { useEffect } from "react";

export function HomeClient({
  posts,
  totalVisitors = 0,
}: {
  posts: PostMetadata[];
  topics?: string[];
  totalVisitors?: number;
}) {
  useEffect(() => {
    const STORAGE_KEY = "blog_session_id";
    let sessionId = localStorage.getItem(STORAGE_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, sessionId);
    }
    recordVisit(sessionId).catch(() => {});
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        <LandingHero />
        <LandingMarquee />
      </div>
      <AboutSection totalVisitors={totalVisitors} />
      <CompetenciesSection />
      <TechStackSection />
      <LatestSection posts={posts} />
    </div>
  );
}
