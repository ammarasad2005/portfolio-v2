"use client";

import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import Button from "../atoms/Button";
import { HiMenuAlt4 } from "react-icons/hi";
import MenuItem from "./MenuItem";
import { useRouter, usePathname } from "next/navigation";
import FooterLabels from "./FooterLabels";
import { motion, AnimatePresence } from "motion/react";
import NavigationTabs from "../organisms/NavigationTabs";

const LazyModal = lazy(() => import("./Modal"));

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const items = useMemo(
    () => [
      { label: "home", path: "/", navigation: <NavigationTabs isWithinMenu /> },
      { label: "projects", path: "/projects" },
    ],
    []
  );

  useEffect(() => {
    items.forEach(({ path }) => {
      router.prefetch(path);
    });
  }, [items, router]);

  const handleToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (path: string) => {
    if (path !== pathname) {
      setPendingPath(path);
    }
    setIsOpen(false);
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);

    if (pendingPath) {
      router.push(pendingPath);
      setPendingPath(null);
    }
  };

  return (
    <>
      <Button
        onClick={handleToggle}
        disabled={isAnimating || isOpen}
        variant="secondary"
        className="w-12 bg-transparent text-[var(--action)]"
        disableAnimation
      >
        <AnimatePresence mode="wait" initial={false}>
          {!isOpen ? (
            <motion.span
              key="menu"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              style={{ display: "inline-block" }}
            >
              <HiMenuAlt4 size={32} />
            </motion.span>
          ) : (
            ""
          )}
        </AnimatePresence>
      </Button>

      <Suspense>
        <LazyModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onAnimationEnd={handleAnimationEnd}
          title="Menu"
          className="flex flex-col h-full justify-between pb-8 pt-16"
        >
          <div className="h-full w-full flex items-center">
            <ul className="flex flex-col items-end gap-10 max-w-[80vw] w-full">
              {items.map(({ label, path, navigation }, index) => (
                <li
                  className="w-full"
                  key={index}
                  onClick={() => handleItemClick(path)}
                >
                  <MenuItem path={path} label={label} />

                  <div className="py-4">{navigation}</div>
                </li>
              ))}
            </ul>
          </div>

          <FooterLabels disableAnimation />
        </LazyModal>
      </Suspense>
    </>
  );
}
