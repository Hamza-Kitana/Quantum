import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Hero } from "@/components/site/Hero";
import { Why } from "@/components/site/Sections2";
import { Explore, Page } from "@/components/site/Pages";
import { Numbers, Outro, Process, Showcase, Ticker, Voices } from "@/components/site/Home";
import { Divider, Reveal } from "@/components/site/Transitions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quantum — Software, AI, Arduino & Tech Training" },
      {
        name: "description",
        content:
          "Quantum builds software and AI solutions, showcases Arduino & AI hardware, and runs programming, Arduino and AI courses.",
      },
      { property: "og:title", content: "Quantum — Software, AI, Arduino & Tech Training" },
      {
        property: "og:description",
        content:
          "Code + Circuits + AI. Software development, AI solutions, Arduino hardware and hands-on tech education.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useLang();
  const h = t.home;
  return (
    <Page>
      <Hero />
      <Ticker />
      <Divider to="about" n={1} label={t.pages.explore.kicker} />
      <Reveal n={1} label={t.pages.explore.kicker}>
        <Explore />
      </Reveal>
      <Divider to="courses" n={2} label={h.process.kicker} />
      <Reveal n={2} label={h.process.kicker}>
        <Process />
      </Reveal>
      <Divider to="projects" n={3} label={h.showcase.kicker} />
      <Reveal n={3} label={h.showcase.kicker}>
        <Showcase />
      </Reveal>
      <Divider to="arduino" n={4} label={h.numbers.kicker} />
      <Reveal n={4} label={h.numbers.kicker}>
        <Numbers />
      </Reveal>
      <Divider to="ai" n={5} label={h.voices.kicker} />
      <Reveal n={5} label={h.voices.kicker}>
        <Voices />
      </Reveal>
      <Divider to="why" n={6} />
      <Reveal n={6} label={t.why.title}>
        <Why />
      </Reveal>
      <Divider to="contact" n={7} label={h.outro.btn} />
      <Outro />
    </Page>
  );
}
