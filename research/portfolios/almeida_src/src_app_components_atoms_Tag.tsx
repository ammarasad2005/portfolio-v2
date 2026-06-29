import { mergeClassNames } from "@/utils/classNames";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tag({ children, className }: TagProps) {
  return (
    <span
      className={mergeClassNames(
        "px-3 py-1",
        "text-xs text-[var(--action)] font-bold capitalize select-none",
        "rounded-full border border-[var(--action)]",
        "transition-all duration-200",
        "bg-[var(--action)]/10",
        className
      )}
    >
      {children}
    </span>
  );
}
