import { AboutSection } from "@/components/sections/about-section";
import { ThreeBackground } from "@/components/three/three-background";
import { ContactSection } from "@/components/sections/contact-section";
import { EducationSection } from "@/components/sections/education-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HomeSection } from "@/components/sections/home-section";
import { MobileDock } from "@/components/sections/mobile-dock";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SiteFooter } from "@/components/sections/site-footer";
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
      <ThreeBackground />
      <div className="relative z-10">
        <SiteHeader />

        <main className="mx-auto w-full max-w-6xl px-6">
          <HomeSection />
          <AboutSection />
          <ProjectsSection projects={projects} />
          <SkillsSection skills={skills} softSkills={softSkills} />
          <EducationSection education={education} />
          <ExperienceSection experience={experience} />
          <ContactSection />
        </main>

        <SiteFooter />

        <MobileDock />
      </div>
    </div>
  );
}
