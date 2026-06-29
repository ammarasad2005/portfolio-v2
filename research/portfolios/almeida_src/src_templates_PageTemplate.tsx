import { mergeClassNames } from "@/utils/classNames";

export default function PageTemplate({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={mergeClassNames(
        "mx-auto max-w-[var(--page-width)] w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
