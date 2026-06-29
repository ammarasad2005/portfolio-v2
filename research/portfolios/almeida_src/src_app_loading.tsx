"use client";
import { useEffect, useState } from "react";

export default function Loading() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enterTimeout = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => {
      clearTimeout(enterTimeout);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      } bg-black/60 backdrop-blur-md`}
    >
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
