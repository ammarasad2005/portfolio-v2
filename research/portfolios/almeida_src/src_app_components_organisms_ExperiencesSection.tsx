import Timeline, { TimelineItem } from "./Timeline";
import TitleAndSubtitleSection from "../molecules/TitleAndSubtitleSection";
import SectionTemplate from "@/templates/SectionTemplate";
import Balloon from "./Balloon";
import DATA from "@/data";
import HighlightText from "../atoms/HighlightText";

export default function Experiences() {
  const companies = DATA.experiences;

  const items = companies.map(
    ({
      name,
      logo,
      role,
      type,
      description,
      achievements,
      start,
      end,
      src,
      alt,
    }) => {
      return {
        component: (
          <Balloon
            label={name}
            logo={logo}
            role={role}
            type={type}
            description={description}
            achievements={
              Array.isArray(achievements) ? achievements : [achievements]
            }
            dateStart={start}
            dateEnd={end}
          />
        ),
        date: {
          start,
          end,
        },
        image: {
          src,
          alt,
        },
      } as TimelineItem;
    }
  );

  return (
    <SectionTemplate id="experiences" className="flex flex-col items-center">
      <TitleAndSubtitleSection
        title="Experiences"
        subtitle={
          <>
            A summary of the <HighlightText>Roles</HighlightText>,{" "}
            <HighlightText>Responsibilities</HighlightText> that have shaped my
            professional path so far
          </>
        }
      >
        <div className="w-full mt-11">
          <Timeline items={items} />
        </div>
      </TitleAndSubtitleSection>
    </SectionTemplate>
  );
}
