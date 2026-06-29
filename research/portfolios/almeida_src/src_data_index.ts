import { StackInterface, stack } from "./stack";
import { SocialMediaInterface, socialMedia } from "./social-media";
import { ProjectInterface, projects } from "./project";
import { ExperienceInterface, experiences } from "./experience";
import { EducationInterface, educations } from "./education";
import { CertificationInterface, certifications } from "./certification";
import { TestimonialInterface, testimonials } from "./testimonial";

interface DataProps {
  stack: Array<StackInterface>;
  socialMedia: Array<SocialMediaInterface>;
  softSkills: Array<string>;
  projects: Array<ProjectInterface>;
  experiences: Array<ExperienceInterface>;
  educations: Array<EducationInterface>;
  certifications: Array<CertificationInterface>;
  testimonials: Array<TestimonialInterface>;
}

const softSkills = [
  // "Communication",
  "Teamwork",
  "Problem-solving",
  // "Adaptability",
  // "Critical thinking",
  "Creativity",
  "Open-mindedness",
  "Emotional intelligence",
  "Attention to detail",
  "Empathy",
  // "Growth mindset",
  // "Active listening",
];

const DATA: DataProps = {
  stack,
  socialMedia,
  softSkills,
  projects,
  experiences,
  educations,
  certifications,
  testimonials,
};

export default DATA;
