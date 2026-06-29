import { mergeClassNames } from "@/utils/classNames";
import { formatedDate } from "@/utils/date";
export interface TimelineDateProps {
  start: string;
  end: string;
  side: "right" | "left";
  className?: string;
}

export default function TimelineDate({
  start,
  end,
  side,
  className,
}: TimelineDateProps) {
  const isSideRight = side === "right";

  return (
    <span
      className={mergeClassNames(
        "text-sm sm:text-base",
        isSideRight ? "text-right" : "text-left",
        className
      )}
    >
      {`${formatedDate(start)} - ${end ? formatedDate(end) : "Present"}`}
    </span>
  );
}
