import SectionTemplate from "@/templates/SectionTemplate";
import TitleAndSubtitleSection from "../molecules/TitleAndSubtitleSection";
import HighlightText from "../atoms/HighlightText";
import Education from "../molecules/Education";
import DATA from "@/data";

export default function EducationSection() {
  const educations = DATA.educations;

  return (
    <>
      <SectionTemplate
        id="education"
        className="flex flex-col items-center justify-center"
      >
        <TitleAndSubtitleSection
          title="Education"
          subtitle={
            <>
              Where <HighlightText>theory</HighlightText>,{" "}
              <HighlightText>research</HighlightText>, and{" "}
              <HighlightText>teaching</HighlightText> shaped the foundations of
              how I think and build
            </>
          }
        >
          {educations.map((education, index) => (
            <Education key={index} {...education} />
          ))}
        </TitleAndSubtitleSection>
      </SectionTemplate>
    </>
  );
}
