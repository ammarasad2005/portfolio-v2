"use client";

import { useEffect } from "react";
import { useTabs } from "@/contexts/TabsContext";
import { NAVIGATION_TAB_INDEX } from "./NavigationTabs";

export default function ScrollSpy() {
  const { isOnClickScrolling, setActiveTab } = useTabs();

  const isScrolling = Boolean(isOnClickScrolling);

  useEffect(() => {
    const ids = Object.values(NAVIGATION_TAB_INDEX);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;
    if (isScrolling) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection?.target.id) {
          setActiveTab(visibleSection.target.id);
        }
      },
      { root: null, threshold: 0.15 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [isScrolling, setActiveTab]);

  return null;
}
