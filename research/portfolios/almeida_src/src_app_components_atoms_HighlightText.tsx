import { mergeClassNames } from "@/utils/classNames";

interface HighlightTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function HighlightText({
  children,
  className,
}: HighlightTextProps) {
  return (
    <span
      className={mergeClassNames("font-bold text-[var(--action)]", className)}
    >
      {children}
    </span>
  );
}
