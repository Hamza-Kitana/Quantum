import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Courses } from "@/components/site/Sections2";
import { CtaBand, NextPage, Page, PageHero } from "@/components/site/Pages";
import { Divider, Reveal } from "@/components/site/Transitions";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses & Training | Quantum" },
      {
        name: "description",
        content: "Programming, web development, Arduino and AI courses at Quantum.",
      },
      { property: "og:title", content: "Courses & Training — Quantum" },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const { t } = useLang();
  return (
    <Page>
      <PageHero id="courses" />
      <Divider to="courses" n={1} />
      <Reveal n={1} label={t.nav.courses}>
        <Courses />
      </Reveal>
      <Divider to="contact" n={2} />
      <Reveal n={2} label={t.nav.contact}>
        <CtaBand />
      </Reveal>
      <NextPage id="courses" />
    </Page>
  );
}
