import { AboutSection } from "@/components/sections/about-section";
import { ScrollSequenceBackground } from "@/components/animations/scroll-sequence-background";
import { ContactSection } from "@/components/sections/contact-section";
import { EducationSection } from "@/components/sections/education-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HomeSection } from "@/components/sections/home-section";
import { MobileDock } from "@/components/sections/mobile-dock";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SiteHeader } from "@/components/sections/site-header";
import { SkillsSection } from "@/components/sections/skills-section";
import {
  education,
  experience,
  projects,
  skills,
  softSkills,
} from "@/lib/portfolio-data";

export default function Home() {
  return (
    <div className="relative isolate min-h-screen bg-background text-foreground">
      <ScrollSequenceBackground />
      <div className="relative z-10">
        <SiteHeader />

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 pb-28 md:py-12 md:pb-12">
          <HomeSection />
          <AboutSection />
          <ProjectsSection projects={projects} />
          <SkillsSection skills={skills} softSkills={softSkills} />
          <EducationSection education={education} />
          <ExperienceSection experience={experience} />
          <ContactSection />
        </main>

        <MobileDock />
      </div>
    </div>
  );
}
