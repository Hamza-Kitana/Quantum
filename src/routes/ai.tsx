import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { AI } from "@/components/site/Sections";
import { CtaBand, NextPage, Page, PageHero } from "@/components/site/Pages";
import { Divider, Reveal } from "@/components/site/Transitions";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Solutions | Quantum" },
      {
        name: "description",
        content:
          "Chatbots, computer vision, predictive analytics, automation and edge AI by Quantum.",
      },
      { property: "og:title", content: "AI Solutions — Quantum" },
    ],
  }),
  component: AiPage,
});

function AiPage() {
  const { t } = useLang();
  return (
    <Page>
      <PageHero id="ai" />
      <Divider to="ai" n={1} />
      <Reveal n={1} label={t.nav.ai}>
        <AI />
      </Reveal>
      <Divider to="contact" n={2} />
      <Reveal n={2} label={t.nav.contact}>
        <CtaBand />
      </Reveal>
      <NextPage id="ai" />
    </Page>
  );
}
