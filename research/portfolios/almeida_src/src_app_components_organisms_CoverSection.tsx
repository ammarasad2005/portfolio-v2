import SoftSkillsCarousel from "@/app/components/molecules/SoftSkillsCarousel";
import Stack from "@/app/components/molecules/Stack";
import SectionTemplate from "@/templates/SectionTemplate";
import Image from "next/image";
import Title from "@/app/components/atoms/Title";
import DownloadButton from "../molecules/DownloadButton";
import AnimatedComponent from "../molecules/AnimatedComponent";
import { mergeClassNames } from "@/utils/classNames";
import NavigationButton from "../atoms/NavigationButton";

export default function CoverSection() {
  const cvFileName = "Matheus_Almeida_CV_Front-End_Software_Engineer.pdf";
  const cvFilePath = `/files/${cvFileName}`;

  return (
    <>
      <SectionTemplate
        id="home"
        className="relative flex flex-col justify-evenly sm:gap-0 gap-16"
        isTranparentBackgroud
        noPaddingInline
      >
        <div className="flex flex-col justify-center mx-4">
          <div className="flex sm:flex-row sm:justify-between flex-col items-center">
            <div className="flex flex-col items gap-6 sm:block w-full sm:w-auto pt-10 sm:pt-0">
              <div className="flex flex-col select-none items-center sm:items-start">
                <Title className="font-normal">Software Engineer</Title>
                <Title>Front-End</Title>
              </div>

              <AnimatedComponent
                HTMLtag="div"
                className="flex sm:hidden items-center justify-center px-4"
              >
                <Image
                  src="/cover/me.webp"
                  width={556}
                  height={500}
                  priority
                  fetchPriority="high"
                  placeholder="empty"
                  alt="matheus, focused programmer wearing a hoodie and headset, working on a laptop."
                  className="relative block z-10"
                />

                <div
                  className={mergeClassNames(
                    "absolute top-[24%] left-[12%] ",
                    "w-[240px] h-[240px]",
                    "bg-[var(--action)]/60 opacity-40 rounded-full ",
                    "blur-[24px] animate-pulse z-0"
                  )}
                />
              </AnimatedComponent>

              <div className="flex gap-6 pt-8 px-4 sm:px-0 sm:w-[296px] w-full">
                <NavigationButton>Contact me</NavigationButton>
                <DownloadButton fileName={cvFileName} filePath={cvFilePath}>
                  Download CV
                </DownloadButton>
              </div>
            </div>

            <AnimatedComponent
              HTMLtag="div"
              className="relative sm:inline-block hidden"
            >
              <Image
                src="/cover/me.webp"
                width={556}
                height={500}
                priority
                fetchPriority="high"
                placeholder="empty"
                alt="matheus, focused programmer wearing a hoodie and headset, working on a laptop."
                className="relative block z-10"
              />

              <div
                className={mergeClassNames(
                  "absolute top-[20%] left-[10%] ",
                  "sm:w-[400px] sm:h-[400px]",
                  "bg-[var(--action)]/60 opacity-40 rounded-full ",
                  "blur-[68px] animate-pulse z-0"
                )}
              />
            </AnimatedComponent>
          </div>

          <div className="flex flex-col sm:flex-row justify-between mt-20 sm:mt-0 items-center sm:items-baseline-last sm:pt-0 pt-6 sm:gap-0 gap-8">
            <Stack className="sm:order-1 order-2" />
          </div>
        </div>

        <SoftSkillsCarousel />
      </SectionTemplate>
    </>
  );
}
