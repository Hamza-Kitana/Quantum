import { type ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { contact } from "@/lib/content";
import { modes } from "./Chrome";
import { useCounter, useGlobalReveal } from "./hooks";
import { PageLink, navPages, pageIndex, pages, usePageReady, type PageId } from "./PageTransition";
import { SplitWords } from "./Transitions";

type SubPage = Exclude<PageId, "home">;

/** Every route renders through this so scroll reveals bind to the freshly mounted page. */
export function Page({ children }: { children: ReactNode }) {
  const { lang } = useLang();
  useGlobalReveal(lang);
  return <>{children}</>;
}

function Fact({
  n,
  s,
  l,
  run,
  delay,
}: {
  n: number;
  s: string;
  l: string;
  run: boolean;
  delay: number;
}) {
  const v = useCounter(n, run);
  return (
    <div
      className={`border-s ps-3 sm:ps-5 transition-all duration-700 ${run ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="font-display text-2xl text-signal rtl:text-right sm:text-3xl md:text-4xl"
        dir="ltr"
      >
        {v}
        {s}
      </div>
      <div className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">{l}</div>
    </div>
  );
}

/** Banner at the top of each inner page: number, breadcrumb, animated title, counters and the page's emblem. */
export function PageHero({ id }: { id: SubPage }) {
  const { t } = useLang();
  const ready = usePageReady();
  const pg = t.pages[id];
  const m = modes[id]!;
  const n = pageIndex(id);
  const fade = (d: number) => ({
    className: `transition-all duration-1000 ${ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`,
    style: { transitionDelay: `${d}ms` },
  });
  return (
    <section
      id="top"
      className="relative flex min-h-[80svh] items-center overflow-hidden grid-bg pb-12 pt-24 sm:min-h-[86vh] sm:pb-16 sm:pt-32"
      style={{ ["--c" as string]: m.color }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 60% at 75% 40%, color-mix(in oklab, ${m.color} 16%, transparent), transparent 70%)`,
        }}
      />
      <span
        aria-hidden
        className={`outline-num pointer-events-none absolute -bottom-[0.18em] end-[-0.04em] select-none font-display text-[38vw] leading-none transition-all duration-[1400ms] md:text-[26vw] ${ready ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}
        dir="ltr"
      >
        0{n}
      </span>

      <div className="relative mx-auto grid w-full max-w-[96rem] items-center gap-14 px-5 sm:px-6 md:px-16 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <nav {...fade(0)} aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground">
              <li>
                <PageLink to="/" className="transition-colors hover:text-cyan">
                  {t.pages.home}
                </PageLink>
              </li>
              <li aria-hidden className="text-cyan/50">
                /
              </li>
              <li style={{ color: m.color }}>{t.nav[id]}</li>
            </ol>
          </nav>
          <p {...fade(150)}>
            <span
              className="mt-8 inline-flex items-center gap-3 rounded-full border px-4 py-1.5 font-mono text-xs tracking-[0.25em]"
              style={{
                borderColor: `color-mix(in oklab, ${m.color} 40%, transparent)`,
                color: m.color,
              }}
            >
              <span dir="ltr">0{n}</span>
              <span className="h-3 w-px bg-current opacity-40" />
              {m.label}
            </span>
          </p>
          <SplitWords
            as="h1"
            ready={ready}
            text={pg.title}
            className="mt-5 font-display text-[2.4rem] leading-[1.1] sm:mt-6 md:text-6xl xl:text-7xl"
          />
          <p {...fade(500)}>
            <span className="mt-5 block max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
              {pg.sub}
            </span>
          </p>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:mt-12 sm:gap-6">
            {pg.facts.map((f, i) => (
              <Fact key={f.l} {...f} run={ready} delay={700 + i * 120} />
            ))}
          </div>
        </div>

        <div
          className={`relative mx-auto hidden aspect-square w-full max-w-sm transition-all duration-[1200ms] lg:block ${ready ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
          style={{ transitionDelay: "300ms" }}
        >
          <div
            className="absolute inset-0 rounded-full border border-dashed animate-spin-slow"
            style={{ borderColor: `color-mix(in oklab, ${m.color} 35%, transparent)` }}
          />
          <div
            className="absolute inset-10 rounded-full border animate-spin-slow"
            style={{
              borderColor: `color-mix(in oklab, ${m.color} 25%, transparent)`,
              animationDirection: "reverse",
              animationDuration: "22s",
            }}
          />
          <div
            className="absolute inset-20 grid place-items-center rounded-full border bg-background/60 backdrop-blur"
            style={{
              borderColor: m.color,
              boxShadow: `0 0 60px -10px ${m.color}, inset 0 0 40px -20px ${m.color}`,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-1/2 w-1/2"
              fill="none"
              stroke={m.color}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 8px ${m.color})` }}
            >
              {m.icon}
            </svg>
          </div>
          {[0, 90, 180, 270].map((a, i) => (
            <span
              key={a}
              className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full animate-pulse-dot"
              style={{
                background: m.color,
                boxShadow: `0 0 12px ${m.color}`,
                transform: `rotate(${a + 45}deg) translateY(-50%) translateX(calc(min(24rem,100%)/2 - 5px))`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-border">
        <span
          className={`block h-full bg-signal transition-transform duration-[1600ms] ease-out ${ready ? "scale-x-100" : "scale-x-0"} origin-left rtl:origin-right`}
          style={{ boxShadow: "var(--glow-cyan)" }}
        />
      </div>
    </section>
  );
}

/** Full-width band leading into the following page. */
export function NextPage({ id }: { id: SubPage }) {
  const { t } = useLang();
  const i = pageIndex(id);
  const next = pages[i + 1] ?? pages[0];
  const name = next.id === "home" ? t.pages.home : t.nav[next.id];
  const blurb = next.id === "home" ? t.hero.sub : t.pages[next.id].blurb;
  const m = modes[next.id]!;
  return (
    <PageLink
      to={next.to}
      className="group relative block overflow-hidden border-t bg-surface px-6 py-20 md:px-16 md:py-28"
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100 rtl:origin-right"
        style={{
          background: `linear-gradient(90deg, color-mix(in oklab, ${m.color} 14%, transparent), transparent)`,
        }}
      />
      <span
        aria-hidden
        className="outline-num pointer-events-none absolute end-6 top-1/2 hidden sm:block -translate-y-1/2 select-none font-display text-[9rem] leading-none transition-transform duration-700 group-hover:scale-110 md:text-[14rem]"
      >
        0{pages.indexOf(next)}
      </span>
      <div className="relative mx-auto flex max-w-[96rem] items-end justify-between gap-8">
        <div className="reveal">
          <p
            className="flex items-center gap-3 font-mono text-xs tracking-[0.3em]"
            style={{ color: m.color }}
          >
            <span className="h-px w-10 bg-current transition-all duration-500 group-hover:w-20" />
            {t.pages.next}
          </p>
          <p className="mt-4 font-display text-3xl transition-colors sm:mt-5 sm:text-4xl duration-500 group-hover:text-signal md:text-7xl">
            {name}
          </p>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:mt-4 sm:text-base">
            {blurb}
          </p>
        </div>
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border sm:h-16 sm:w-16 transition-all duration-500 group-hover:border-transparent group-hover:bg-signal group-hover:text-primary-foreground md:h-24 md:w-24">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1 md:h-8 md:w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </PageLink>
  );
}

/** Home: a door to every page. */
export function Explore() {
  const { t } = useLang();
  return (
    <section id="explore" className="relative px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36">
      <div className="mx-auto max-w-[96rem]">
        <div className="mb-10 max-w-3xl md:mb-14">
          <p className="reveal mb-4 font-mono text-xs tracking-[0.25em] text-cyan">
            {t.pages.explore.kicker}
          </p>
          <SplitWords
            text={t.pages.explore.title}
            className="font-display text-3xl leading-tight md:text-5xl"
          />
          <p className="reveal mt-5 text-lg text-muted-foreground">{t.pages.explore.sub}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {navPages.map((p, i) => {
            const m = modes[p.id]!;
            return (
              <PageLink
                key={p.id}
                to={p.to}
                className={`reveal group relative flex min-h-44 flex-col overflow-hidden rounded-2xl border bg-card/60 p-4 transition-all duration-500 active:scale-[0.97] hover:-translate-y-1.5 md:min-h-64 md:p-7 ${i === 0 ? "col-span-2" : ""}`}
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(80% 80% at 100% 0%, color-mix(in oklab, ${m.color} 18%, transparent), transparent 70%)`,
                    boxShadow: `inset 0 0 0 1px ${m.color}`,
                  }}
                />
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute -bottom-6 -end-6 h-28 w-28 opacity-[0.06] md:h-40 md:w-40 transition-all duration-700 group-hover:-rotate-12 group-hover:scale-110 group-hover:opacity-20"
                  fill="none"
                  stroke={m.color}
                  strokeWidth="1"
                >
                  {m.icon}
                </svg>
                <div className="relative flex items-center justify-between">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl border transition-all duration-500 group-hover:scale-110 md:h-12 md:w-12"
                    style={{ borderColor: `color-mix(in oklab, ${m.color} 40%, transparent)` }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="none"
                      stroke={m.color}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {m.icon}
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="relative mt-auto pt-6 font-display text-lg md:pt-10 md:text-2xl">
                  {t.nav[p.id]}
                </h3>
                <p className="relative mt-1.5 line-clamp-2 text-xs text-muted-foreground md:mt-2 md:text-sm">
                  {t.pages[p.id].blurb}
                </p>
                <span
                  className="relative mt-5 hidden items-center gap-2 font-mono text-xs tracking-widest md:inline-flex"
                  style={{ color: m.color }}
                >
                  {t.pages.explore.enter}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-1.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </PageLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Closing call to action used on home and service pages. */
export function CtaBand() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 70% at 50% 50%, color-mix(in oklab, var(--violet) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <SplitWords
          text={t.pages.cta.title}
          className="font-display text-4xl leading-tight md:text-6xl"
        />
        <p className="reveal mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {t.pages.cta.sub}
        </p>
        <div className="reveal mt-10 flex flex-wrap justify-center gap-4">
          <PageLink
            to="/contact"
            className="rounded-full bg-signal px-8 py-4 font-semibold text-primary-foreground glow-cyan transition-transform hover:scale-[1.04]"
          >
            {t.pages.cta.btn}
          </PageLink>
          <a
            href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(t.contact.waHello)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border px-8 py-4 transition-colors hover:border-cyan hover:text-cyan"
          >
            {t.pages.cta.alt}
          </a>
        </div>
      </div>
    </section>
  );
}
