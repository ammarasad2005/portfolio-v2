import SectionTemplate from "@/templates/SectionTemplate";
import TitleAndSubtitleSection from "../molecules/TitleAndSubtitleSection";
import Form from "@/app/components/organisms/Form";
import Footer from "./Footer";
import HighlightText from "@/app/components/atoms/HighlightText";

export default function CTASection() {
  return (
    <>
      <SectionTemplate
        id="contact"
        className="flex flex-col justify-between min-h-0"
      >
        <TitleAndSubtitleSection
          title="Do you like my work?"
          subtitle={
            <>
              <span>
                Have a <HighlightText>project in mind</HighlightText>, a{" "}
                <HighlightText>question</HighlightText>, or just want to{" "}
                <HighlightText>say hello</HighlightText>?<br />
                Feel free to reach out, I{`'`}m always open to connect!
              </span>
            </>
          }
          className="my-16 sm:mt-28 sm:mb-12"
        >
          <div className="w-full flex justify-center">
            <Form />
          </div>
        </TitleAndSubtitleSection>

        <Footer className="mt-24" />
      </SectionTemplate>
    </>
  );
}
