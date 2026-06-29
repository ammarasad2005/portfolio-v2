import { mergeClassNames } from "@/utils/classNames";
import { ProjectProps } from "../molecules/Project";
import StickyStack from "../molecules/StickyStack";
import { isEven } from "@/utils/math";

interface ProjectsPreviewProps {
  projects: Array<ProjectProps>;
  className?: string;
}

export default function ProjectsPreview({
  projects,
  className,
}: ProjectsPreviewProps) {
  const leftStack = Array<ProjectProps>();
  const rightStack = Array<ProjectProps>();

  const currentProjects = projects.slice(0, 6);

  currentProjects.forEach((project, index) =>
    isEven(index) ? leftStack.push(project) : rightStack.push(project)
  );

  return (
    <div
      className={mergeClassNames(
        "relative w-full flex items-center",
        "h-[1900px] sm:h-[1480px]",
        className
      )}
    >
      <StickyStack
        projects={currentProjects}
        side="middle"
        keyPrefix="middle"
        className="block sm:hidden"
      />

      <StickyStack
        projects={leftStack}
        side="left"
        keyPrefix="left"
        className="hidden sm:block"
      />
      <StickyStack
        projects={rightStack}
        side="right"
        keyPrefix="right"
        className="hidden sm:block"
      />
    </div>
  );
}
