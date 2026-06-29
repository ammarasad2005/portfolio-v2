"use client";

import AnimatedComponent from "../molecules/AnimatedComponent";
import Select from "../molecules/Select";
import { mergeClassNames } from "@/utils/classNames";

interface Option {
  label: string;
  value: string;
}

export interface Filter {
  key: string;
  options: Array<Option>;
}

export interface FiltersBarProps {
  filters: Array<Filter>;
  onChange: (label: string, value: string) => void;
}

export default function FiltersBar({ filters, onChange }: FiltersBarProps) {
  return (
    <AnimatedComponent
      HTMLtag="div"
      className={mergeClassNames(
        "flex items-center justify-center relative overflow-visible",
        "sm:pb-4 mb-8 gap-4 rounded-lg w-full max-w-[640px]",
        "bg-[var(--color-background)]/60 backdrop-blur-3xl"
      )}
    >
      {filters.map(({ key, options }, index) => (
        <Select
          key={index}
          label={key}
          options={options}
          onChange={(value) => onChange(key, value)}
        />
      ))}
    </AnimatedComponent>
  );
}
