import { FaExternalLinkAlt } from "react-icons/fa";
import { formatedDateMonthYear } from "@/utils/date";
import { mergeClassNames } from "@/utils/classNames";

import Image from "next/image";
import Tag from "../atoms/Tag";
import AnimatedComponent from "./AnimatedComponent";
import { CertificationInterface } from "@/data/certification";

export default function Certification({
  title,
  issuer,
  date,
  link,
  skills,
}: CertificationInterface) {
  return (
    <AnimatedComponent
      HTMLtag="div"
      className="bg-[var(--color-background)] text-[var(--color-foreground)] sm:p-6 rounded-xl"
    >
      <AnimatedComponent
        HTMLtag="div"
        className="flex flex-row gap-4 justify-between items-start pb-2 mb-4"
      >
        {issuer.image && (
          <Image
            src={issuer.image}
            width={56}
            height={56}
            alt={`logo from ${issuer.name} issuer`}
            className={mergeClassNames("rounded-full sm:inline-block")}
          />
        )}
        <div className="flex gap-2">
          <div className="flex flex-col items-baseline text-xs sm:text-sm">
            <h2 className="text-base sm:text-lg font-semibold">{title}</h2>

            <div className="flex items-center gap-2 pb-4">
              <p className="text-[var(--color-foreground)]/40">{issuer.name}</p>

              <span className="w-1 h-1 bg-[var(--color-foreground)]/40 rounded-full" />
              <p className="text-[var(--color-foreground)]/40">
                {formatedDateMonthYear(date)}
              </p>
            </div>

            <div className="flex items-center gap-4 justify-between w-full">
              <div>
                {skills.map((item, index) => (
                  <Tag key={index}>{item}</Tag>
                ))}
              </div>

              <a
                href={link}
                target="_blank"
                className="flex items-baseline justify-center gap-2"
              >
                <FaExternalLinkAlt
                  size={18}
                  className="block text-[var(--action)]"
                />
              </a>
            </div>
          </div>
        </div>
      </AnimatedComponent>
    </AnimatedComponent>
  );
}
