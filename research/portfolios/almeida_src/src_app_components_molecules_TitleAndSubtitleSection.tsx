import Title from "../atoms/Title";
import Subtitle from "../atoms/Subtitle";
import { mergeClassNames } from "@/utils/classNames";

interface TitleAndSubtitleSectionProps {
  children: React.ReactNode;
  title: string;
  subtitle: string | React.ReactNode;
  className?: string;
}

export default function TitleAndSubtitleSection({
  children,
  title,
  subtitle,
  className,
}: TitleAndSubtitleSectionProps) {
  return (
    <>
      <div
        className={mergeClassNames(
          "flex flex-col items-center justify-center w-full z-30 mb-6 sm:mb-12",
          className
        )}
      >
        <Title className="text-center">{title}</Title>
        <Subtitle className="pt-4 text-center">{subtitle}</Subtitle>
      </div>

      {children}
    </>
  );
}
