import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Contact } from "@/components/site/Sections2";
import { NextPage, Page, PageHero } from "@/components/site/Pages";
import { Divider, Reveal } from "@/components/site/Transitions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Quantum" },
      { name: "description", content: "Contact Quantum via WhatsApp, phone, email or Instagram." },
      { property: "og:title", content: "Contact — Quantum" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLang();
  return (
    <Page>
      <PageHero id="contact" />
      <Divider to="contact" n={1} />
      <Reveal n={1} label={t.nav.contact}>
        <Contact />
      </Reveal>
      <NextPage id="contact" />
    </Page>
  );
}
