"use client";

import { useEffect } from "react";
import type { PostMetadata } from "@/lib/mdx";
import { recordVisit } from "@/lib/api";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingMarquee } from "@/components/landing/landing-marquee";
import { AboutSection } from "@/components/landing/about-section";
import { CompetenciesSection } from "@/components/landing/competencies-section";
import { TechStackSection } from "@/components/landing/tech-stack-section";
import { LatestSection } from "@/components/landing/latest-section";
import { CtaSection } from "@/components/landing/cta-section";

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
    <div style={{ width: "100%" }}>
      <LandingHero />
      <LandingMarquee />
      <AboutSection totalVisitors={totalVisitors} />
      <CompetenciesSection />
      <TechStackSection />
      <LatestSection posts={posts} />
      <CtaSection />
    </div>
  );
}
