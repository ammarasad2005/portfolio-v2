import ErrorPageTemplate from "@/templates/ErrorPageTemplate";
import HighlightText from "@/app/components/atoms/HighlightText";

export default function NotFound() {
  return (
    <ErrorPageTemplate
      code={404}
      description={
        <>
          This page could <HighlightText>not be found.</HighlightText>
        </>
      }
    />
  );
}
