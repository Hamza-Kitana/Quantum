import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { About } from "@/components/site/Sections";
import { Why } from "@/components/site/Sections2";
import { Gallery } from "@/components/site/LabSections";
import { NextPage, Page, PageHero } from "@/components/site/Pages";
import { Divider, Reveal } from "@/components/site/Transitions";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Quantum" },
      {
        name: "description",
        content:
          "Who Quantum is: a technology lab for software, AI, Arduino hardware and tech education.",
      },
      { property: "og:title", content: "About — Quantum" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useLang();
  return (
    <Page>
      <PageHero id="about" />
      <Divider to="about" n={1} />
      <Reveal n={1} label={t.nav.about}>
        <About />
      </Reveal>
      <Divider to="why" n={2} />
      <Reveal n={2} label={t.why.title}>
        <Why />
      </Reveal>
      <Divider to="projects" n={3} label={t.about.gallery.kicker} />
      <Reveal n={3} label={t.about.gallery.kicker}>
        <Gallery />
      </Reveal>
      <NextPage id="about" />
    </Page>
  );
}
