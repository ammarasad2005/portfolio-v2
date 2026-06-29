import { mergeClassNames } from "@/utils/classNames";
import Tag from "../atoms/Tag";
import Image from "next/image";
import AnimatedComponent from "./AnimatedComponent";
import ProjectHeader from "../atoms/ProjectHeader";

export type Category = "personal" | "freelancer" | "probono";

export interface ProjectProps {
  className?: string;
  title: string;
  about: string;
  technologies: Array<string>;
  image: string;
  link: string;
  categories?: Array<Category>;
}

export default function Project({
  className,
  title,
  about,
  technologies,
  image,
  link,
  categories,
}: ProjectProps) {
  return (
    <AnimatedComponent
      HTMLtag="div"
      className={mergeClassNames(
        "relative w-full min-h-60 sm:min-h-96 group rounded-b-2xl",
        className
      )}
    >
      <ProjectHeader
        className="rounded-t-2xl"
        categories={categories}
        link={link}
      />

      <div className="relative w-full h-60 sm:h-96 overflow-hidden rounded-b-2xl bg-[var(--color-background)]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="auto"
          className={mergeClassNames(
            "object-cover group-hover:scale-110",
            "transition-transform rounded-b-2xl"
          )}
        />

        <div
          className={mergeClassNames(
            "absolute top-0 left-0 opacity-100 sm:opacity-0",
            "flex flex-col gap-2 sm:gap-4 justify-between bg-[var(--color-background)]/90 sm:bg-stone-800",
            "w-full h-full p-4 sm:p-4 rounded-b-2xl",
            "sm:group-hover:opacity-100 transition-opacity duration-400"
          )}
        >
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-base sm:text-lg text-[var(--action)] font-semibold sm:font-bold max-w-[65%]">
                {title}
              </h3>
            </div>

            <p className="text-xs sm:text-base font-normal text-justify pt-2 sm:pt-4 mx-auto">
              {about}
            </p>
          </div>

          <div className="flex gap-2 sm:gap-4 flex-wrap">
            {technologies.map((item, index) => (
              <Tag key={index}>{item}</Tag>
            ))}
          </div>
        </div>
      </div>
    </AnimatedComponent>
  );
}
