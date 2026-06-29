import { formatedDateMonthYear } from "@/utils/date";
import { EducationInterface } from "@/data/education";

import Image from "next/image";
import AnimatedComponent from "./AnimatedComponent";
import EducationExtraCurricular from "../molecules/EducationExperience";
import { mergeClassNames } from "@/utils/classNames";
import { VscMortarBoard } from "react-icons/vsc";

export default function Education({
  title,
  abbreviation,
  university,
  start,
  end,
  experiences,
}: EducationInterface) {
  return (
    <AnimatedComponent
      HTMLtag="div"
      className="bg-[var(--color-background)] text-[var(--color-foreground)] sm:p-6 rounded-xl"
    >
      {/* Header */}
      <AnimatedComponent
        HTMLtag="div"
        className="flex flex-col sm:flex-row justify-between items-start pb-2 mb-4"
      >
        <div className="flex flex-row gap-4 justify-between items-start pb-2 mb-4">
          {university.image && (
            <Image
              src={university.image}
              width={56}
              height={56}
              alt={`logo from ${university.name}`}
              className={mergeClassNames("rounded-full sm:inline-block")}
            />
          )}

          <div className="flex flex-col items-baseline text-xs sm:text-base">
            <h2 className="text-lg sm:text-xl font-semibold">
              <VscMortarBoard
                size={24}
                className="text-[var(--action)] inline mr-2"
              />
              {title}
              <span className="font-bold"> ({abbreviation})</span>
            </h2>

            <p className="text-[var(--color-foreground)]/40">
              {university.name} ({university.abbreviation})
            </p>
            <p className="text-[var(--color-foreground)]/40 italic">
              {university.originalName}
            </p>
            <p className="text-[var(--color-foreground)]/40 mt-1">
              {formatedDateMonthYear(start)} - {formatedDateMonthYear(end)}
            </p>
          </div>
        </div>
      </AnimatedComponent>

      {/* Experiences */}
      <div>
        {experiences.map((exp, index) => (
          <EducationExtraCurricular
            role={exp.role}
            start={exp.start}
            end={exp.end}
            description={exp.description}
            university={university.abbreviation}
            key={index}
            className={experiences.length - 1 == index ? "pb-0" : ""}
          />
        ))}
      </div>
    </AnimatedComponent>
  );
}
