import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Arduino } from "@/components/site/Sections2";
import { NextPage, Page, PageHero } from "@/components/site/Pages";
import { Divider, Reveal } from "@/components/site/Transitions";

export const Route = createFileRoute("/arduino")({
  head: () => ({
    meta: [
      { title: "Arduino & Hardware | Quantum" },
      {
        name: "description",
        content:
          "Arduino boards, kits, sensors and AI modules available at Quantum - ask on WhatsApp.",
      },
      { property: "og:title", content: "Arduino & Hardware — Quantum" },
    ],
  }),
  component: ArduinoPage,
});

function ArduinoPage() {
  const { t } = useLang();
  return (
    <Page>
      <PageHero id="arduino" />
      <Divider to="arduino" n={1} />
      <Reveal n={1} label={t.nav.arduino}>
        <Arduino />
      </Reveal>
      <NextPage id="arduino" />
    </Page>
  );
}
