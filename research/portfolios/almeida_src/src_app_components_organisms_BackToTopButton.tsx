"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

import { NAVIGATION_TAB_INDEX, scrollIntoSection } from "./NavigationTabs";
import { useTabs } from "@/contexts/TabsContext";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { setActiveTab, setIsOnClickScrolling } = useTabs();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    setActiveTab(NAVIGATION_TAB_INDEX.HOME);
    setIsOnClickScrolling(true);
    scrollIntoSection(NAVIGATION_TAB_INDEX.HOME);

    setTimeout(() => setIsOnClickScrolling(false), 1200);
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-20 p-4 rounded-full shadow-lg transition-all duration-300
        bg-stone-800 hover:bg-stone-700 text-[var(--action)]
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <FaArrowUp size={18} />
    </button>
  );
}
