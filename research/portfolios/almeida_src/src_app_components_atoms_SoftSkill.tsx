import { mergeClassNames } from "@/utils/classNames";

interface SoftSkillProps {
  label: string;
  className?: string;
}

export default function SoftSkill({ label, className }: SoftSkillProps) {
  return (
    <span
      className={mergeClassNames(
        "text-3xl font-bold text-gray-200 h-9 text-center mx-4 select-all transition-colors duration-200",
        className
      )}
    >
      {label}
    </span>
  );
}
