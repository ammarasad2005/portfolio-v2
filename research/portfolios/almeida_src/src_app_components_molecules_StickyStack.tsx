import { ProjectProps } from "./Project";
import { mergeClassNames } from "@/utils/classNames";
import Project from "./Project";

interface StickyStackProps {
  projects: ProjectProps[];
  side: "left" | "right" | "middle";
  keyPrefix: string;
  className?: string;
}

export default function StickyStack({
  projects,
  side,
  keyPrefix,
  className,
}: StickyStackProps) {
  const isLeftSide = side === "left";
  const isMiddle = side === "middle";

  const alignmentClass = isMiddle
    ? "absolute top-0 w-full flex flex-col items-start"
    : isLeftSide
    ? "absolute left-0 top-0 w-1/2 flex flex-col items-start"
    : "absolute right-0 top-0 w-1/2 flex flex-col items-end";

  return (
    <div className={mergeClassNames(alignmentClass, className)}>
      {projects.map((project, i) => (
        <div
          key={`${keyPrefix}-${i}`}
          className={mergeClassNames(
            "sticky top-16 flex mb-12",
            isLeftSide ? "sm:pr-4" : "sm:pl-4"
          )}
          style={{ zIndex: i }}
        >
          <Project {...project} />
        </div>
      ))}
    </div>
  );
}
