import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Projects, Why } from "@/components/site/Sections2";
import { StudentProjects } from "@/components/site/LabSections";
import { NextPage, Page, PageHero } from "@/components/site/Pages";
import { Divider, Reveal } from "@/components/site/Transitions";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects | Quantum" },
      {
        name: "description",
        content:
          "Selected Quantum projects: IoT, web apps, computer vision, chatbots and robotics.",
      },
      { property: "og:title", content: "Projects — Quantum" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { t } = useLang();
  return (
    <Page>
      <PageHero id="projects" />
      <Divider to="projects" n={1} />
      <Reveal n={1} label={t.nav.projects}>
        <Projects />
      </Reveal>
      <Divider to="courses" n={2} label={t.projects.student.kicker} />
      <Reveal n={2} label={t.projects.student.kicker}>
        <StudentProjects />
      </Reveal>
      <Divider to="why" n={3} />
      <Reveal n={3} label={t.why.title}>
        <Why />
      </Reveal>
      <NextPage id="projects" />
    </Page>
  );
}
