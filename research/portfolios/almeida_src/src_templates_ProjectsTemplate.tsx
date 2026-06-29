"use client";

import { useState } from "react";
import PageLayout from "@/layouts/PageLayout";
import TitleAndSubtitleSection from "@/app/components/molecules/TitleAndSubtitleSection";
import SectionTemplate from "./SectionTemplate";
import DATA from "@/data";
import Project from "@/app/components/molecules/Project";
import CTASection from "@/app/components/organisms/ContactSection";
import FiltersBar from "@/app/components/organisms/FiltersBar";
import { useMemo } from "react";
import { ProjectInterface } from "@/data/project";
import { motion, AnimatePresence } from "motion/react";
import AnimatedComponent from "@/app/components/molecules/AnimatedComponent";
import HighlightText from "@/app/components/atoms/HighlightText";

const createLabelValueObject = (labels: Array<string> | Set<string>) => {
  const labelsArray = [{ label: "All", value: "" }];

  labels.forEach((label) => labelsArray.push({ label: label, value: label }));

  labelsArray.sort((a, b) => (a.label >= b.label ? 1 : -1));
  return labelsArray;
};

export default function ProjectsTemplate() {
  const technologies = new Set<string>();
  DATA.projects.forEach((project) =>
    project.technologies.forEach((technology) => technologies.add(technology))
  );

  const filters = [
    {
      key: "categories",
      options: [
        { label: "All", value: "" },
        { label: "Personal", value: "personal" },
        { label: "Freelancer", value: "freelancer" },
        { label: "Pro bono", value: "probono" },
      ],
    },
    {
      key: "technologies",
      options: createLabelValueObject(technologies),
    },
  ];

  const initialFilterState = filters.reduce((acc, { key }) => {
    acc[key] = "";
    return acc;
  }, {} as Record<string, string>);
  const [filterState, setFilterState] = useState(initialFilterState);
  const filtersKeys = filters.map(({ key }) => key as keyof ProjectInterface);

  const handleFilterChange = (label: string, value: string) => {
    setFilterState((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const projectsView = useMemo(() => {
    let filteredProjects = [...DATA.projects];

    filtersKeys.forEach((key) => {
      const filterValue = filterState[key];
      if (filterValue) {
        filteredProjects = filteredProjects.filter((project) => {
          const field = project[key];
          if (Array.isArray(field)) {
            return field.includes(filterValue);
          } else {
            return field === filterValue;
          }
        });
      }
    });

    return filteredProjects;
  }, [filterState, filtersKeys]);

  return (
    <PageLayout>
      <SectionTemplate className="rounded-b-2xl">
        <TitleAndSubtitleSection
          title="Projects"
          subtitle={
            <>
              A collection of <HighlightText>freelance</HighlightText>,{" "}
              <HighlightText>personal</HighlightText>, and{" "}
              <HighlightText>pro bono</HighlightText> projects that shaped my
              journey
            </>
          }
          className="my-16 sm:mt-28 sm:mb-12"
        >
          <div className="w-full flex justify-center">
            <FiltersBar filters={filters} onChange={handleFilterChange} />
          </div>

          {projectsView.length ? (
            <AnimatedComponent
              HTMLtag="div"
              className="flex flex-wrap sm:grid sm:grid-cols-2 md:grid-cols-2 gap-4"
              forceView
            >
              <AnimatePresence>
                {projectsView.map((project) => (
                  <motion.div
                    layout
                    key={`${project.title}`}
                    initial={{
                      opacity: 0,
                      transform: "scale(0.95) translateY(10px)",
                    }}
                    animate={{
                      opacity: 1,
                      transform: "scale(1) translateY(0)",
                    }}
                    exit={{
                      opacity: 0,
                      transform: "scale(0.95) translateY(-10px)",
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <Project {...project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </AnimatedComponent>
          ) : (
            <AnimatedComponent
              HTMLtag="span"
              className="w-full flex justify-center text-center"
            >
              Oops! No projects match your filter. Maybe in the future :)
            </AnimatedComponent>
          )}
        </TitleAndSubtitleSection>
      </SectionTemplate>
      <CTASection />
    </PageLayout>
  );
}
