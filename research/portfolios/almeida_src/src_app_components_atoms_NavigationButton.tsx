"use client";

import {
  NAVIGATION_TAB_INDEX,
  scrollIntoSection,
} from "../organisms/NavigationTabs";
import Button from "./Button";

interface NavigationButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function NavigationButton({
  children,
  className,
  variant = "primary",
}: NavigationButtonProps) {
  const handleOnClick = () => {
    scrollIntoSection(NAVIGATION_TAB_INDEX.CONTACT);
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => handleOnClick()}
    >
      {children}
    </Button>
  );
}
