"use client";

import { mergeClassNames } from "@/utils/classNames";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface AnimatedComponentProps {
  HTMLtag: keyof typeof motion;
  children?: React.ReactNode;
  forceView?: boolean;
  disableAnimation?: boolean;
  className?: string;
  delay?: number;
  slideUp?: boolean;
}

export default function AnimatedComponent({
  children,
  className,
  HTMLtag,
  forceView = false,
  disableAnimation = false,
  delay = 0,
  slideUp = false,
  ...rest
}: AnimatedComponentProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const MotionComponent = motion[HTMLtag] as React.ElementType;
  const shouldAnimate = !disableAnimation && (forceView || isInView);

  const motionDefaultProps = {
    transition: { duration: 0.4, delay, ease: "easeOut" },
  };

  const motionProps = slideUp
    ? {
        initial: { opacity: 0, y: -60 },
        animate: shouldAnimate ? { opacity: 1, y: 0 } : undefined,
        ...motionDefaultProps,
      }
    : {
        initial: { opacity: 0, y: 40, scale: 0.8 },
        animate: shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : undefined,
        ...motionDefaultProps,
      };

  return (
    <MotionComponent
      ref={ref}
      {...(!disableAnimation && motionProps)}
      className={mergeClassNames(className)}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
