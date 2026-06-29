import Image from "next/image";
import { mergeClassNames } from "@/utils/classNames";
import AnimatedComponent from "../molecules/AnimatedComponent";

interface SVGGlowProps {
  delay?: number;
  label: string;
  src: string;
  color: string;
  className?: string;
  imgSize?: number;
  enableGrayScale?: boolean;
}

const borderMap: Record<string, string> = {
  green: "sm:group-hover:border-green-500 border-green-500 sm:border-black/0",
  cyan: "sm:group-hover:border-cyan-500 border-cyan-500 sm:border-black/0",
  sky: "sm:group-hover:border-sky-500 border-sky-500 sm:border-black/0",
  teal: "sm:group-hover:border-teal-500 border-teal-500 sm:border-black/0",
  lime: "sm:group-hover:border-lime-500 border-lime-500 sm:border-black/0",
  amber: "sm:group-hover:border-amber-500 border-amber-500 sm:border-black/0",
  red: "sm:group-hover:border-red-500 border-red-500 sm:border-red/0",
  slate: "sm:group-hover:border-white border-white sm:border-black/0",
};

const shadowMap: Record<string, string> = {
  green:
    "sm:group-hover:drop-shadow-[0_0_4px_#22c55e] drop-shadow-[0_0_4px_#22c55e] sm:drop-shadow-none",
  cyan: "sm:group-hover:drop-shadow-[0_0_4px_#06b6d4] drop-shadow-[0_0_4px_#06b6d4] sm:drop-shadow-none",
  sky: "sm:group-hover:drop-shadow-[0_0_4px_#0ea5e9] drop-shadow-[0_0_4px_#0ea5e9] sm:drop-shadow-none",
  teal: "sm:group-hover:drop-shadow-[0_0_4px_#14b8a6] drop-shadow-[0_0_4px_#14b8a6] sm:drop-shadow-none",
  lime: "sm:group-hover:drop-shadow-[0_0_4px_#84cc16] drop-shadow-[0_0_4px_#84cc16] sm:drop-shadow-none",
  amber:
    "sm:group-hover:drop-shadow-[0_0_4px_#f59e0b] drop-shadow-[0_0_4px_#f59e0b] sm:drop-shadow-none",
  red: "sm:group-hover:drop-shadow-[0_0_4px_#fb2c36] drop-shadow-[0_0_4px_#fb2c36] sm:drop-shadow-none",
  slate:
    "sm:group-hover:drop-shadow-[0_0_4px_#ffffff] drop-shadow-[0_0_4px_#ffffff] sm:drop-shadow-none",
};

export default function SVGGlow({
  delay,
  label,
  src,
  color,
  className,
  imgSize,
  enableGrayScale = false,
}: SVGGlowProps) {
  const borderColor = `border-gray-200/0 ${borderMap[color] ?? ""}`;
  const shadowClass = shadowMap[color] ?? "";

  const imageComponentClasses = mergeClassNames(
    enableGrayScale ? "sm:grayscale sm:brightness-50 sm:invert" : "",
    "group-hover:grayscale-0 group-hover:brightness-100 group-hover:invert-0",
    "transition-all duration-300 ease-in-out"
  );

  return (
    <AnimatedComponent
      HTMLtag="div"
      className="group"
      delay={delay ? delay * 0.2 : 0}
    >
      <div
        className={mergeClassNames(
          "flex items-center justify-center w-10 h-10 p-1",
          "bg-[var(--color-background)]/95 rounded border sm:border-2",
          borderColor,
          shadowClass,
          "transition-all duration-300 ease-in-out",
          className
        )}
      >
        <Image
          src={src}
          width={imgSize ? imgSize : 32}
          height={imgSize ? imgSize : 32}
          alt={`${label} icon`}
          className={imageComponentClasses}
        />
      </div>
    </AnimatedComponent>
  );
}
