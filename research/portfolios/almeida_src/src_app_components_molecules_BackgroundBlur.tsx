"use client";

import { useEffect, useState } from "react";

export default function BackgroundBlur() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[var(--color-background)] blur-[1px]">
      <LineDrops />
    </div>
  );
}

function LineDrops() {
  const [lines, setLines] = useState<number[]>([]);
  useEffect(() => {
    const isSmall = window.matchMedia("(max-width: 400px)").matches;
    const total = isSmall ? 30 : 80;
    setLines(Array.from({ length: total }, (_, i) => i));
  }, []);

  return (
    <>
      {lines.map((i) => {
        const left = Math.random() * 140 - 20;
        const delay = Math.random() * 5;
        const duration = 3 + Math.random() * 10;
        const fontSize = 12 + Math.random() * 8;

        return (
          <div
            key={i}
            className="absolute whitespace-pre text-xs font-mono text-[var(--color-foreground)]/6"
            style={{
              left: `${left}%`,
              top: "-200px",
              fontSize: `${fontSize}px`,
              opacity: 0.1,
              animation: `codeFall ${duration}s linear ${delay}s infinite`,
            }}
          >
            {generateRandomCode()}
          </div>
        );
      })}
    </>
  );
}

function generateRandomCode() {
  const chars = "TURNING COFFEE INTO CODE";
  let result = "";
  for (let i = 0; i < 20; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    result += char + "\n";
  }
  return result;
}
