import AnimatedComponent from "./AnimatedComponent";

interface FooterLabelsProps {
  disableAnimation?: boolean;
}

export default function FooterLabels({
  disableAnimation = false,
}: FooterLabelsProps) {
  return (
    <AnimatedComponent
      disableAnimation={disableAnimation}
      HTMLtag="div"
      className="flex flex-col gap-4 items-center"
    >
      <AnimatedComponent
        disableAnimation={disableAnimation}
        HTMLtag="span"
        className="flex flex-col sm:flex-row gap-2 text-xs sm:text-base font-normal text-gray-200/50 select-none text-center"
      >
        <AnimatedComponent
          disableAnimation={disableAnimation}
          HTMLtag="div"
          delay={0}
          className="flex gap-2"
        >
          <AnimatedComponent
            disableAnimation={disableAnimation}
            HTMLtag="span"
            delay={0}
          >
            Copyright © 2025
          </AnimatedComponent>
          <AnimatedComponent
            disableAnimation={disableAnimation}
            HTMLtag="span"
            delay={0}
          >
            -
          </AnimatedComponent>
          <AnimatedComponent
            disableAnimation={disableAnimation}
            HTMLtag="span"
            delay={0}
          >
            Matheus Almeida
          </AnimatedComponent>
        </AnimatedComponent>
        <AnimatedComponent
          disableAnimation={disableAnimation}
          HTMLtag="span"
          delay={0}
          className="hidden sm:inline"
        >
          -
        </AnimatedComponent>
        <AnimatedComponent
          disableAnimation={disableAnimation}
          HTMLtag="span"
          delay={0}
        >
          All Rights Reserved
        </AnimatedComponent>
      </AnimatedComponent>
    </AnimatedComponent>
  );
}
