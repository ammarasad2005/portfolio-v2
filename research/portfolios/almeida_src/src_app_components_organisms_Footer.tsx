import PageTemplate from "@/templates/PageTemplate";
import SocialMedia from "../molecules/SocialMedia";
import FooterLabels from "../molecules/FooterLabels";
import { mergeClassNames } from "@/utils/classNames";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <PageTemplate className={mergeClassNames(className, "px-0 pb-6")}>
      <div className="flex flex-col gap-6 items-center w-full rounded bg-[var(--color-background)]/60 p-4 backdrop-blur-lg">
        <SocialMedia svgClassName="bg-transparent border-none drop-shadow-none" />

        <FooterLabels />
      </div>
    </PageTemplate>
  );
}
