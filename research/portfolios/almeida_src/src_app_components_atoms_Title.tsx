import { mergeClassNames } from "@/utils/classNames";
import AnimatedComponent from "../molecules/AnimatedComponent";

interface TitleProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Title({ children, className }: TitleProps) {
  return (
    <AnimatedComponent
      className={mergeClassNames(
        "text-4xl sm:text-6xl font-bold text-center sm:text-left",
        className
      )}
      HTMLtag="h1"
    >
      {children}
    </AnimatedComponent>
  );
}
