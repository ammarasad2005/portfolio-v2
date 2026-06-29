import Image from "next/image";
import Tag from "../atoms/Tag";
import { mergeClassNames } from "@/utils/classNames";
import CompanyTime from "../atoms/CompanyTime";
import { FaCheck } from "react-icons/fa";

interface BaloonProps {
  label: string;
  logo: string;
  role: string;
  type: string;
  description: string | null;
  achievements: Array<string>;
  dateStart?: string;
  dateEnd?: string | null;
}

export default function Balloon({
  label,
  logo,
  role,
  type,
  description,
  achievements,
  dateStart,
  dateEnd,
}: BaloonProps) {
  return (
    <div
      className={mergeClassNames(
        "relative sm:min-w-[520px] sm:p-4",
        "bg-[var(--color-background)]/60 backdrop-blur-3xl rounded",
      )}
    >
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="order-2 sm:order-1">
          <div className="flex gap-1 items-baseline">
            <h3 className="font-semibold text-2xl sm:text-4xl">{label}</h3>
            <span className="text-xs capitalize">({type})</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-baseline mt-2 sm:mt-4">
            <Tag className="order-2 sm:order-1">{role}</Tag>

            {dateStart && dateEnd && (
              <CompanyTime
                start={dateStart}
                end={dateEnd}
                className="order-1 sm:order-2"
              />
            )}
          </div>
        </div>

        {logo && (
          <div
            className={mergeClassNames(
              "flex items-center justify-center",
              "bg-white rounded-xl sm:ml-2 mb-4 sm:p-1",
              "order-1 sm:order-2 min-h-16 sm:min-h-auto",
            )}
          >
            <Image
              src={logo}
              width={120}
              height={48}
              alt={`${label} company`}
              unoptimized
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
      </div>

      <ul className="mt-4! text-xs sm:text-lg">
        <li className="font-light">
          <p>{description}</p>

          <div className="flex flex-col gap-1 mt-4">
            {achievements.map((achievement, index) => (
              <span
                key={index}
                className="flex items-start gap-2 font-semibold leading-relaxed"
              >
                <FaCheck className="mt-1 text-[var(--action)] flex-shrink-0" />
                {achievement}
              </span>
            ))}
          </div>
        </li>
      </ul>
    </div>
  );
}
