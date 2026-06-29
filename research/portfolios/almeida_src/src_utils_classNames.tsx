import { twMerge } from "tailwind-merge";

export function mergeClassNames(
  ...classes: (string | undefined | null | false)[]
) {
  return twMerge(classes.filter(Boolean).join(" "));
}
