"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";

interface RouterButtonProps {
  children: React.ReactNode;
  path: string;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function RouterButton({
  children,
  path,
  className,
  variant = "primary",
}: RouterButtonProps) {
  const router = useRouter();

  if (!router) {
    return;
  }

  const handleOnClick = () => {
    router.push(`/${path}`);
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
