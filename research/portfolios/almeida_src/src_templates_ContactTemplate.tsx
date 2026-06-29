import PageLayout from "@/layouts/PageLayout";
import SectionTemplate from "./SectionTemplate";
import TitleAndSubtitleSection from "@/app/components/molecules/TitleAndSubtitleSection";
import Form from "@/app/components/organisms/Form";
import HighlightText from "@/app/components/atoms/HighlightText";

export default function ContactTemplate() {
  return (
    <PageLayout>
      <SectionTemplate>
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
      </SectionTemplate>
    </PageLayout>
  );
}
