import { mergeClassNames } from "@/utils/classNames";
import AnimatedComponent from "./AnimatedComponent";

interface CarouselProps {
  list: Array<React.ReactNode>;
}

export default function Carousel({ list }: CarouselProps) {
  return (
    <AnimatedComponent
      forceView
      HTMLtag="div"
      className={mergeClassNames(
        "relative overflow-hidden py-4 whitespace-nowrap group bg-[var(--color-background)] sm:rounded-2xl",
        "before:absolute before:pointer-events-none before:top-0 before:left-0  before:w-20 before:sm:w-52 before:h-52 before:z-1",
        "before:linear before:bg-gradient-to-l before:from-white/0 before:to-[var(--color-background)]",
        "after:absolute after:pointer-events-none after:top-0 after:right-0 after:w-20 after:sm:w-52 after:h-52 after:z-1",
        "after:linear after:bg-gradient-to-r after:from-white/0 after:to-[var(--color-background)]"
      )}
    >
      {[...Array(2)].map((_, index) => (
        <div
          key={index}
          className={mergeClassNames(
            "inline-block animate-[carousel-left_45s_linear_infinite]",
            "group-hover:[animation-play-state:paused]"
          )}
        >
          {list}
        </div>
      ))}
    </AnimatedComponent>
  );
}
