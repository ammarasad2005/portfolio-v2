"use client";

import HomeTemplate from "@/templates/HomeTemplate";

import { useEffect } from "react";
import { initAnalytics } from "@/services/firebase";

export default function Home() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return <HomeTemplate />;
}
