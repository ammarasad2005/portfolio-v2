"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Logo() {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className="flex items-center gap-2.5 cursor-pointer text-xl sm:text-2xl"
    >
      <span className="opacity-20">{"<"}</span>
      <span className="mix-blend-difference text-[var(--color-foreground)]">
        Matheus Almeida
      </span>

      <span>
        <span className="opacity-20">{"/"}</span>
        <span className="opacity-20">{">"}</span>
      </span>
    </Link>
  );
}
