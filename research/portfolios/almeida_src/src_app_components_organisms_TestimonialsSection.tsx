import TitleAndSubtitleSection from "../molecules/TitleAndSubtitleSection";
import SectionTemplate from "@/templates/SectionTemplate";
import Testimonial from "../molecules/Testimonial";
import DATA from "@/data";
import HighlightText from "../atoms/HighlightText";
import Button from "../atoms/Button";

import { FaArrowRight } from "react-icons/fa6";

export default function TestimonialsSection() {
  const testimonials = DATA.testimonials;
  return (
    <SectionTemplate
      id="testimonials"
      className="flex flex-col items-center sm:rounded-b-2xl"
    >
      <TitleAndSubtitleSection
        title="Testimonials"
        subtitle={
          <>
            From <HighlightText>Clients</HighlightText>,{" "}
            <HighlightText>Teammates</HighlightText>, and{" "}
            <HighlightText>Classmates</HighlightText> who have collaborated with
            me along the way
          </>
        }
      >
        <div className="mt-11 flex flex-wrap justify-center gap-12 sm:gap-6">
          {testimonials.map(({ name, role, descriptions }, index) => (
            <Testimonial
              key={index}
              label={name}
              role={role}
              description={descriptions}
            />
          ))}
        </div>

        <Button className="self-end mt-11 w-46" variant="primary">
          <a
            href="https://www.linkedin.com/in/dev-almeida-matheus/details/recommendations/"
            target="_blank"
          >
            <span className="flex items-center gap-1">
              Check it out here
              <FaArrowRight className="animate-arrow-bounce" size={18} />
            </span>
          </a>
        </Button>
      </TitleAndSubtitleSection>
    </SectionTemplate>
  );
}
