import { mergeClassNames } from "@/utils/classNames";
import SVGGlow from "./SVGGlow";
import DATA from "@/data";

interface SocialMediaProps {
  svgClassName?: string;
  className?: string;
  enableGrayScale?: boolean;
}

export default function SocialMedia({
  svgClassName,
  className,
  enableGrayScale = false,
}: SocialMediaProps) {
  const itens = DATA.socialMedia;

  return (
    <div className={mergeClassNames("flex gap-4", className)}>
      {itens.map(({ name, link, color }, index) => (
        <a key={index} target="_blank" href={link}>
          <SVGGlow
            label={name}
            delay={index}
            src={`/cover/${name}.svg`}
            color={color}
            className={svgClassName}
            enableGrayScale={enableGrayScale}
          />
        </a>
      ))}
    </div>
  );
}
