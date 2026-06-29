import { isEven } from "@/utils/math";
import TimelineDate, { TimelineDateProps } from "../atoms/TimelineDate";
import { mergeClassNames } from "@/utils/classNames";
import Image from "next/image";
import AnimatedComponent from "../molecules/AnimatedComponent";

interface ImageTimeline {
  src: string;
  alt: string;
}

export interface TimelineItem {
  component: React.ReactNode;
  date: TimelineDateProps;
  image: ImageTimeline;
}

interface TimelineProps {
  items: Array<TimelineItem>;
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative w-full">
      <div className="hidden sm:block absolute left-1/2 top-0 h-full border-l-2 border-gray-300 -translate-x-1/2 z-0" />

      <div className="flex flex-col gap-20 relative z-10">
        {items.map(({ component, date, image }, index) => {
          const isLeft = isEven(index);

          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row w-full sm:items-start sm:justify-between group"
            >
              <AnimatedComponent
                HTMLtag="div"
                className={mergeClassNames(
                  "hidden sm:block absolute left-1/2 -translate-x-1/2",
                  "w-6 h-6 mt-4",
                  "bg-gray-200 rounded-full z-10",
                  "group-hover:drop-shadow-[0_0_4px_#ffffff] transition-all duration-200"
                )}
              />

              {isLeft ? (
                <>
                  <AnimatedComponent
                    HTMLtag="div"
                    className="order-2 sm:order-1 w-full sm:w-1/2 sm:pr-4 flex flex-col sm:flex-row justify-end"
                  >
                    {component}
                  </AnimatedComponent>
                  <AnimatedComponent
                    HTMLtag="div"
                    className="order-1 sm:order-2 relative w-full sm:w-1/2 pl-0 sm:pl-10 flex justify-end sm:justify-start mt-4 group"
                  >
                    <TimelineDate
                      start={date.start}
                      end={date.end}
                      side="right"
                      className="sm:group-hover:rotate-6 sm:group-hover:translate-x-6 rotate-0 transition-all duration-400 mb-2 mr-3 sm:mb-0 sm:mr-0"
                    />

                    {image.src && (
                      <div
                        className={mergeClassNames(
                          "w-[520px] h-[348px] hidden sm:inline-block absolute -top-4 left-6 z-[-1]",
                          "opacity-0 invisible transition-all duration-300 rotate-90 scale-10",
                          "group-hover:visible group-hover:opacity-50 group-hover:rotate-6 group-hover:scale-100 ease-out bg-black"
                        )}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </AnimatedComponent>
                </>
              ) : (
                <>
                  <AnimatedComponent
                    HTMLtag="div"
                    className="order-2 w-full sm:w-1/2 sm:pl-4 flex flex-col sm:flex-row justify-end"
                  >
                    {component}
                  </AnimatedComponent>
                  <AnimatedComponent
                    HTMLtag="div"
                    className="order-1 relative w-full sm:w-1/2 pr-0 sm:pr-10 flex justify-end mt-4 group"
                  >
                    <TimelineDate
                      start={date.start}
                      end={date.end}
                      side="right"
                      className="sm:group-hover:-rotate-6 sm:group-hover:-translate-x-6 rotate-0 transition-all duration-400 mb-2 mr-3 sm:mb-0 sm:mr-0"
                    />

                    {image.src && (
                      <div
                        className={mergeClassNames(
                          "w-[520px] h-[348px] hidden sm:inline-block absolute -top-4 left-10 z-[-1]",
                          "opacity-0 invisible transition-all duration-300 -rotate-90 scale-10",
                          "group-hover:visible group-hover:opacity-50 group-hover:-rotate-6 group-hover:scale-100 ease-out bg-black"
                        )}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </AnimatedComponent>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
