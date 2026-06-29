import SectionTemplate from "@/templates/SectionTemplate";
import TitleAndSubtitleSection from "../molecules/TitleAndSubtitleSection";
import HighlightText from "../atoms/HighlightText";
import DATA from "@/data";
import Certification from "../molecules/Certification";

export default function CertificationSection() {
  const certifications = DATA.certifications;

  return (
    <>
      <SectionTemplate
        id="certification"
        className="flex flex-col items-center justify-center"
      >
        <TitleAndSubtitleSection
          title="Certifications"
          subtitle={
            <>
              Milestones that validate my dedication to{" "}
              <HighlightText>learning</HighlightText>,{" "}
              <HighlightText>growth</HighlightText>, and{" "}
              <HighlightText>professional excellence</HighlightText>
            </>
          }
        >
          <div className="flex flex-row flex-wrap items-center justify-center">
            {certifications.map((certification, index) => (
              <Certification key={index} {...certification} />
            ))}
          </div>
        </TitleAndSubtitleSection>
      </SectionTemplate>
    </>
  );
}
