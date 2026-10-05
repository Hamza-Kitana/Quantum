import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Software } from "@/components/site/Sections";
import { CtaBand, NextPage, Page, PageHero } from "@/components/site/Pages";
import { Divider, Reveal } from "@/components/site/Transitions";

export const Route = createFileRoute("/software")({
  head: () => ({
    meta: [
      { title: "Software Solutions | Quantum" },
      {
        name: "description",
        content: "Web development, mobile apps, custom software, dashboards and APIs by Quantum.",
      },
      { property: "og:title", content: "Software Solutions — Quantum" },
    ],
  }),
  component: SoftwarePage,
});

function SoftwarePage() {
  const { t } = useLang();
  return (
    <Page>
      <PageHero id="software" />
      <Divider to="software" n={1} />
      <Reveal n={1} label={t.nav.software}>
        <Software />
      </Reveal>
      <Divider to="contact" n={2} />
      <Reveal n={2} label={t.nav.contact}>
        <CtaBand />
      </Reveal>
      <NextPage id="software" />
    </Page>
  );
}
