import { mergeClassNames } from "@/utils/classNames";
import AnimatedComponent from "../molecules/AnimatedComponent";

interface SubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function Subtitle({ children, className }: SubtitleProps) {
  return (
    <AnimatedComponent
      className={mergeClassNames("text-xs sm:text-base font-normal", className)}
      HTMLtag="h2"
    >
      {children}
    </AnimatedComponent>
  );
}
