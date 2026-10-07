import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { SectionHead } from "./Chrome";
import { useCounter, useInView } from "./hooks";
import { PageLink } from "./PageTransition";
import { SplitWords, useScrollFrame } from "./Transitions";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const isRtl = () => document.documentElement.dir === "rtl";
const projImgs = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../../assets/projects/*.webp", { eager: true, import: "default" }),
  ).map(([path, url]) => [path.split("/").pop()!.replace(".webp", ""), url]),
);

function Spark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="currentColor" aria-hidden>
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
    </svg>
  );
}

/** Two endless ribbons of disciplines that lean into the scroll direction. */
export function Ticker() {
  const { t } = useLang();
  const lean = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let last = scrollY;
    let cur = 0;
    let raf = 0;
    const tick = () => {
      const v = scrollY - last;
      last = scrollY;
      cur += (Math.max(-10, Math.min(10, v * 0.35)) - cur) * 0.12;
      if (lean.current) lean.current.style.transform = `skewX(${-cur}deg)`;
      raf = Math.abs(cur) > 0.02 || v !== 0 ? requestAnimationFrame(tick) : 0;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
    };
  }, []);
  const words = t.home.marquee;
  const loop = [...words, ...words];
  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y bg-surface/70 py-6 md:py-10"
      dir="ltr"
    >
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(90deg, var(--background), transparent 12%, transparent 88%, var(--background))",
        }}
      />
      <div ref={lean} className="will-change-transform">
        <div
          className="flex w-max animate-marquee items-center"
          style={{ animationDuration: "45s" }}
        >
          {loop.map((w, i) => (
            <span key={i} className="flex items-center">
              <span
                className="whitespace-nowrap px-6 font-display text-4xl md:px-10 md:text-7xl"
                style={
                  i % 2
                    ? { color: "transparent", WebkitTextStroke: "1px oklch(0.82 0.14 215 / 55%)" }
                    : undefined
                }
              >
                {w}
              </span>
              <Spark className="h-5 w-5 text-cyan md:h-8 md:w-8" />
            </span>
          ))}
        </div>
        <div
          className="mt-4 flex w-max animate-marquee items-center md:mt-6"
          style={{ animationDuration: "60s", animationDirection: "reverse" }}
        >
          {loop.map((w, i) => (
            <span
              key={i}
              className="flex items-center gap-6 whitespace-nowrap px-6 font-mono text-xs tracking-[0.3em] text-muted-foreground md:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet" />
              {w}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const stepIcons: ReactNode[] = [
  <>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4.5-4.5" />
  </>,
  <>
    <path d="M4 20l4-1 11-11-3-3L5 16z" />
    <path d="M14 6l3 3" />
  </>,
  <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  <>
    <path d="M12 3c3 2 5 6 5 10l-2 3H9l-2-3c0-4 2-8 5-10z" />
    <circle cx="12" cy="10" r="1.6" />
    <path d="M9 19l-1 2M15 19l1 2M12 19v3" />
  </>,
  <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M8.5 12l2.5 2.5 4.5-5" />,
];

/** Pinned on desktop: the five stages slide sideways as you scroll while a trace charges across them. */
export function Process() {
  const { t } = useLang();
  const s = t.home.process;
  const n = s.steps.length;
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  useScrollFrame(wrap, (r, vh) => {
    const el = track.current!;
    if (innerWidth < 768) {
      el.style.transform = "";
      setActive(n);
      return;
    }
    const p = clamp01(-r.top / (r.height - vh));
    const dist = Math.max(0, el.scrollWidth - el.parentElement!.clientWidth);
    el.style.transform = `translate3d(${(isRtl() ? 1 : -1) * p * dist}px,0,0)`;
    fill.current!.style.transform = `scaleX(${p})`;
    setActive(Math.min(n - 1, Math.floor(p * n * 0.999)));
  });
  return (
    <section id="process" className="relative bg-surface">
      <div ref={wrap} className="relative md:h-[340vh]">
        <div className="px-5 py-20 sm:px-6 sm:py-28 md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-center md:overflow-hidden md:px-16 md:py-0">
          <div
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{
              background:
                "radial-gradient(60% 50% at 80% 30%, color-mix(in oklab, var(--cyan) 10%, transparent), transparent 70%)",
            }}
          />
          <div className="relative mx-auto w-full max-w-[96rem]">
            <div className="flex items-end justify-between gap-8">
              <SectionHead kicker={s.kicker} title={s.title} sub={s.sub} />
              <div className="mb-14 hidden shrink-0 font-display md:block" dir="ltr">
                <span className="text-6xl text-signal lg:text-7xl">
                  0{Math.min(active, n - 1) + 1}
                </span>
                <span className="text-2xl text-muted-foreground"> / 0{n}</span>
              </div>
            </div>
            <div className="md:overflow-visible">
              <div
                ref={track}
                className="relative flex flex-col gap-4 will-change-transform md:w-max md:flex-row md:gap-6 md:pe-16"
              >
                <span className="absolute inset-x-0 top-3 hidden h-px bg-border md:block" />
                <span
                  ref={fill}
                  className="absolute inset-x-0 top-3 hidden h-[2px] origin-left scale-x-0 bg-signal md:block rtl:origin-right"
                  style={{ boxShadow: "var(--glow-cyan)" }}
                />
                {s.steps.map((st, i) => {
                  const on = i <= active;
                  return (
                    <div key={st.t} className="relative md:w-[400px] md:pt-12 lg:w-[440px]">
                      <span
                        className="absolute start-8 top-0 z-10 hidden h-6 w-6 place-items-center rounded-full border-2 bg-background transition-all duration-500 md:grid"
                        style={{
                          borderColor: on ? "var(--cyan)" : "var(--border)",
                          boxShadow: on ? "0 0 16px var(--cyan)" : "none",
                        }}
                      >
                        <span
                          className="h-2 w-2 rounded-full transition-colors duration-500"
                          style={{ background: on ? "var(--cyan)" : "transparent" }}
                        />
                      </span>
                      <article
                        className="reveal group relative flex min-h-56 flex-col overflow-hidden rounded-2xl border bg-background/80 p-6 md:h-[340px] md:p-8"
                        style={{
                          borderColor: on
                            ? "color-mix(in oklab, var(--cyan) 40%, transparent)"
                            : undefined,
                          boxShadow: on
                            ? "0 20px 60px -30px color-mix(in oklab, var(--cyan) 60%, transparent)"
                            : "none",
                        }}
                      >
                        <span className="outline-num pointer-events-none absolute -top-2 end-4 font-display text-8xl leading-none md:text-9xl">
                          0{i + 1}
                        </span>
                        <span
                          className={`grid h-12 w-12 place-items-center rounded-xl border transition-all duration-500 ${on ? "border-cyan/50 bg-cyan/10" : ""}`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6"
                            fill="none"
                            stroke={on ? "var(--cyan)" : "currentColor"}
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {stepIcons[i]}
                          </svg>
                        </span>
                        <span className="mt-6 font-mono text-[11px] tracking-[0.3em] text-cyan">
                          {s.step} 0{i + 1}
                        </span>
                        <h3 className="mt-auto pt-6 font-display text-3xl md:text-4xl">{st.t}</h3>
                        <p className="mt-3 text-muted-foreground">{st.d}</p>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Featured projects stack on top of each other; the one underneath sinks back as the next arrives. */
export function Showcase() {
  const { t } = useLang();
  const s = t.home.showcase;
  const items = t.projects.items.slice(0, 4);
  const list = useRef<HTMLDivElement>(null);
  useScrollFrame(list, (_r, vh) => {
    const cards = [...list.current!.children] as HTMLElement[];
    cards.forEach((c, i) => {
      const inner = c.firstElementChild as HTMLElement;
      const next = cards[i + 1];
      if (!next) return;
      const ct = c.getBoundingClientRect().top;
      const p = clamp01((vh - next.getBoundingClientRect().top) / Math.max(1, vh - ct));
      inner.style.transform = `scale(${1 - p * 0.07})`;
      inner.style.filter = `brightness(${1 - p * 0.5})`;
    });
  });
  return (
    <section id="showcase" className="relative px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36">
      <div className="mx-auto max-w-[96rem]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead kicker={s.kicker} title={s.title} sub={s.sub} />
          <PageLink
            to="/projects"
            className="reveal mb-14 hidden items-center gap-3 rounded-full border px-6 py-3 font-mono text-xs tracking-widest transition-colors hover:border-violet hover:text-violet md:inline-flex"
          >
            {s.all}
            <Arrow />
          </PageLink>
        </div>
        <div ref={list}>
          {items.map((p, i) => (
            <div
              key={p.k}
              className="sticky mb-[12vh] last:mb-0"
              style={{ top: `calc(5.5rem + ${i * 1.25}rem)` }}
            >
              <article className="group relative h-[62svh] origin-top overflow-hidden rounded-3xl border bg-background transition-[filter] md:h-[70vh]">
                <img
                  src={projImgs[p.k]}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent rtl:bg-gradient-to-l" />
                <div className="absolute start-5 top-5 flex items-center gap-3 md:start-10 md:top-10">
                  <span className="rounded-full border border-cyan/40 bg-background/70 px-3 py-1 font-mono text-[11px] tracking-widest text-cyan backdrop-blur">
                    {p.tag}
                  </span>
                  <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                    {p.meta}
                  </span>
                </div>
                <span className="absolute end-5 top-4 font-display text-6xl text-foreground/15 md:end-10 md:top-8 md:text-8xl">
                  0{i + 1}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-10">
                  <h3 className="max-w-3xl font-display text-3xl leading-tight md:text-6xl">
                    {p.name}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm text-muted-foreground md:mt-4 md:text-lg">
                    {p.desc}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center md:hidden">
          <PageLink
            to="/projects"
            className="inline-flex items-center gap-3 rounded-full border px-6 py-3 font-mono text-xs tracking-widest"
          >
            {s.all}
            <Arrow />
          </PageLink>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 rtl:-scale-x-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Stat({ n, s, l, i, run }: { n: number; s: string; l: string; i: number; run: boolean }) {
  const v = useCounter(n, run, 2000);
  return (
    <div className="group relative overflow-hidden border-b border-e p-6 transition-colors hover:bg-background/50 md:p-10">
      <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">
        0{i + 1}
      </span>
      <div
        className="mt-6 whitespace-nowrap font-display text-4xl leading-none text-signal rtl:text-right sm:text-5xl md:mt-10 md:text-6xl 2xl:text-7xl"
        dir="ltr"
      >
        {v}
        {s}
      </div>
      <p className="mt-4 text-sm text-muted-foreground md:text-base">{l}</p>
      <span
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-signal transition-transform duration-[1.6s] ease-out rtl:origin-right"
        style={{ transform: `scaleX(${run ? 1 : 0})`, transitionDelay: `${i * 150}ms` }}
      />
    </div>
  );
}

/** Full-bleed counter wall. */
export function Numbers() {
  const { t } = useLang();
  const s = t.home.numbers;
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  return (
    <section
      id="numbers"
      className="relative overflow-hidden border-y bg-surface grid-bg px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 100%, color-mix(in oklab, var(--violet) 16%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[96rem]">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="reveal mb-4 font-mono text-xs tracking-[0.25em] text-cyan">{s.kicker}</p>
          <SplitWords text={s.title} className="font-display text-3xl leading-tight md:text-5xl" />
        </div>
        <div ref={ref} className="grid grid-cols-2 border-s border-t lg:grid-cols-4">
          {s.items.map((it, i) => (
            <Stat key={it.l} {...it} i={i} run={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Quote({
  q,
  n,
  r,
  dir,
  className = "w-[300px] md:w-[420px]",
}: {
  q: string;
  n: string;
  r: string;
  dir: "rtl" | "ltr";
  className?: string;
}) {
  return (
    <figure
      dir={dir}
      className={`flex shrink-0 flex-col rounded-2xl border bg-card/70 p-6 transition-colors hover:border-cyan/40 md:p-8 ${className}`}
    >
      <div className="flex items-center justify-between">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-cyan/60" fill="currentColor" aria-hidden>
          <path d="M9.5 6C6 7.3 4 10 4 13.5V18h6v-6H7c0-2.2 1.2-3.8 3.3-4.6zM19.5 6c-3.5 1.3-5.5 4-5.5 7.5V18h6v-6h-3c0-2.2 1.2-3.8 3.3-4.6z" />
        </svg>
        <span className="flex gap-0.5 text-cyan" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <Spark key={i} className="h-3 w-3" />
          ))}
        </span>
      </div>
      <blockquote className="mt-5 flex-1 text-base leading-relaxed md:text-lg">{q}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-signal font-display text-sm text-primary-foreground">
          {n.charAt(0)}
        </span>
        <span>
          <span className="block font-semibold">{n}</span>
          <span className="block text-xs text-muted-foreground">{r}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Testimonials drifting past in two opposite lanes; hovering a lane pauses it. */
export function Voices() {
  const { t, lang } = useLang();
  const s = t.home.voices;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const half = Math.ceil(s.items.length / 2);
  const lanes = [s.items.slice(0, half), s.items.slice(half)];
  return (
    <section id="voices" className="relative overflow-hidden py-20 sm:py-28 md:py-36">
      <div className="mx-auto max-w-[96rem] px-5 sm:px-6 md:px-16">
        <SectionHead kicker={s.kicker} title={s.title} />
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-6 sm:px-6 md:hidden">
        {s.items.map((v) => (
          <Quote key={v.n} {...v} dir={dir} className="w-[82vw] max-w-sm snap-start" />
        ))}
      </div>
      <div
        className="hidden space-y-6 md:block"
        dir="ltr"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        }}
      >
        {lanes.map((lane, li) => {
          const loop = [...lane, ...lane, ...lane, ...lane];
          return (
            <div
              key={li}
              className="flex w-max animate-marquee gap-4 pe-4 hover:[animation-play-state:paused] md:gap-6 md:pe-6"
              style={{
                animationDuration: `${55 + li * 15}s`,
                animationDirection: li ? "reverse" : undefined,
              }}
            >
              {loop.map((v, i) => (
                <Quote key={i} {...v} dir={dir} />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Closing statement: giant words that charge with light as you scroll to them. */
export function Outro() {
  const { t } = useLang();
  const s = t.home.outro;
  const ref = useRef<HTMLElement>(null);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const ghosts = useRef<(HTMLSpanElement | null)[]>([]);
  useScrollFrame(ref, (r, vh) => {
    const p = clamp01((vh * 0.85 - r.top) / (r.height * 0.75));
    fills.current.forEach((f, i) => {
      if (!f) return;
      const q = clamp01(p * s.words.length - i);
      const ghost = ghosts.current[i];
      if (ghost) ghost.style.opacity = String(1 - q);
      const cut = (1 - q) * 100;
      f.style.clipPath = isRtl() ? `inset(-30% 0 -30% ${cut}%)` : `inset(-30% ${cut}% -30% 0)`;
    });
  });
  return (
    <section
      id="outro"
      ref={ref}
      className="relative overflow-hidden px-5 pb-28 pt-16 sm:px-6 md:px-16 md:pb-40 md:pt-24"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 60%, color-mix(in oklab, var(--blue) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[96rem]">
        {s.words.map((w, i) => (
          <div
            key={w}
            className={`relative w-fit font-display text-[17vw] leading-[1.05] md:text-[10vw] rtl:leading-[1.35] ${i === 1 ? "ms-[8vw]" : i === 2 ? "ms-[16vw]" : ""}`}
          >
            <span
              ref={(el) => {
                ghosts.current[i] = el;
              }}
              className="outline-num block"
            >
              {w}
            </span>
            <span
              ref={(el) => {
                fills.current[i] = el;
              }}
              aria-hidden
              className="text-signal absolute inset-0 block"
              style={{ clipPath: "inset(-30% 100% -30% 0)" }}
            >
              {w}
            </span>
          </div>
        ))}
        <div className="mt-12 flex flex-col items-start gap-8 md:mt-16 md:flex-row md:items-center md:justify-between">
          <p className="reveal max-w-xl text-lg text-muted-foreground md:text-xl">{s.sub}</p>
          <PageLink
            to="/about"
            className="reveal group inline-flex items-center gap-3 rounded-full bg-signal px-8 py-4 font-semibold text-primary-foreground glow-cyan transition-transform hover:scale-[1.04]"
          >
            {s.btn}
            <Arrow />
          </PageLink>
        </div>
      </div>
    </section>
  );
}
