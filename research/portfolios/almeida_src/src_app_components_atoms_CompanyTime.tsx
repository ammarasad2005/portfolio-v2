import { mergeClassNames } from "@/utils/classNames";
import { getCompactDuration } from "@/utils/date";

interface CompanyTimeProps {
  start: string;
  end: string;
  className?: string;
}

export default function CompanyTime({
  start,
  end,
  className,
}: CompanyTimeProps) {
  return (
    <span className={mergeClassNames("text-xs", className)}>
      {getCompactDuration(start, end)}
    </span>
  );
}
