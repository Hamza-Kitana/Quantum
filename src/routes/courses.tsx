import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Courses } from "@/components/site/Sections2";
import { CourseCatalog, Faq } from "@/components/site/CourseCatalog";
import { CtaBand, NextPage, Page, PageHero } from "@/components/site/Pages";
import { Divider, Reveal } from "@/components/site/Transitions";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses & Training | Quantum" },
      {
        name: "description",
        content:
          "17 courses at Quantum: AI, machine learning, XR/VR/AR, Unity, Unreal, Arduino, robotics, Python, C#, C++, game and web development, UI/UX, cyber security and data science.",
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
      <Divider to="courses" n={2} label={t.courses.catalogTitle} />
      <Reveal n={2} label={t.courses.catalogTitle}>
        <CourseCatalog />
      </Reveal>
      <Divider to="why" n={3} label={t.faq.kicker} />
      <Reveal n={3} label={t.faq.kicker}>
        <Faq />
      </Reveal>
      <Divider to="contact" n={4} />
      <Reveal n={4} label={t.nav.contact}>
        <CtaBand />
      </Reveal>
      <NextPage id="courses" />
    </Page>
  );
}
