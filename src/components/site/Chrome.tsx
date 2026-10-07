import { useEffect, useState, type ReactNode } from "react";
import logo from "@/assets/quantum-mark.webp";
import { useLang } from "@/lib/i18n";
import { contact } from "@/lib/content";
import { useRouterState } from "@tanstack/react-router";
import { SplitWords } from "./Transitions";
import { PageLink, navPages, pageOf } from "./PageTransition";
import { scrollToTop } from "./hooks";

export function Loader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1300);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-700 ${gone ? "pointer-events-none opacity-0" : ""}`}
    >
      <div className="relative h-28 w-28">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 animate-spin-slow"
          style={{ animationDuration: "2.4s" }}
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="1.5"
            strokeDasharray="60 230"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="var(--violet)"
            strokeWidth="1"
            strokeDasharray="20 60"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center">
          <img src={logo} alt="" className="logo-glow h-16 w-16 animate-pulse-dot object-contain" />
        </span>
      </div>
      <p
        className="absolute bottom-[38%] font-mono text-[10px] tracking-[0.4em] text-muted-foreground"
        dir="ltr"
      >
        BOOTING SIGNAL…
      </p>
    </div>
  );
}

export function Nav() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const active = pageOf(useRouterState({ select: (s) => s.location.pathname })).id;
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 30);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "glass py-2" : "py-3 md:py-4"}`}
    >
      <div aria-hidden className="h-[env(safe-area-inset-top)]" />
      <div className="mx-auto flex max-w-[96rem] items-center justify-between px-4 sm:px-5 md:px-10">
        <PageLink to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Quantum logo"
            className="logo-glow h-10 w-10 object-contain md:h-11 md:w-11"
          />
          {/* On phones the brand gives way to the page title once scrolled, like an app bar. */}
          <span className="relative grid">
            <span
              className={`col-start-1 row-start-1 font-display text-sm tracking-[0.3em] text-signal transition-all duration-500 ${scrolled && active !== "home" ? "max-lg:-translate-y-2 max-lg:opacity-0" : ""}`}
              style={{ fontFamily: "Michroma" }}
              dir="ltr"
            >
              QUANTUM
            </span>
            {active !== "home" && (
              <span
                className={`col-start-1 row-start-1 whitespace-nowrap font-display text-base transition-all duration-500 lg:hidden ${scrolled ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
              >
                {t.nav[active]}
              </span>
            )}
          </span>
        </PageLink>
        <nav className="hidden items-center gap-7 lg:flex">
          {navPages.map((p) => (
            <PageLink
              key={p.id}
              to={p.to}
              aria-current={active === p.id ? "page" : undefined}
              className={`group relative text-sm transition-colors hover:text-cyan ${active === p.id ? "text-cyan" : "text-muted-foreground"}`}
            >
              {t.nav[p.id]}
              <span
                className={`absolute -bottom-1.5 start-0 h-px bg-signal transition-all duration-500 ${active === p.id ? "w-full" : "w-0 group-hover:w-1/2"}`}
              />
            </PageLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border p-0.5 font-mono text-xs" dir="ltr">
            {(["ar", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-3 py-1 transition-colors ${lang === l ? "bg-signal text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      <MobileProgress />
    </header>
  );
}

/** Thin signal bar under the header on screens where the side rail is hidden. */
function MobileProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      setP(h > 0 ? scrollY / h : 0);
    };
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  return (
    <div className="absolute inset-x-0 bottom-0 h-px md:hidden">
      <div
        className="h-full origin-left bg-signal rtl:origin-right"
        style={{ transform: `scaleX(${p})`, boxShadow: "var(--glow-cyan)" }}
      />
    </div>
  );
}

type Mode = { label: string; color: string; icon: ReactNode };
export const modes: Record<string, Mode> = {
  home: { label: "SIGNAL", color: "var(--cyan)", icon: <path d="M2 12h5l2-5 3 10 2-5h8" /> },
  about: {
    label: "BOOT",
    color: "var(--cyan)",
    icon: (
      <>
        <path d="M12 3v8" />
        <path d="M7 6.5a7 7 0 1 0 10 0" />
      </>
    ),
  },
  software: {
    label: "</> CODE",
    color: "var(--cyan)",
    icon: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  },
  ai: {
    label: "NEURAL",
    color: "var(--violet)",
    icon: (
      <>
        <circle cx="5" cy="6" r="2" />
        <circle cx="5" cy="18" r="2" />
        <circle cx="19" cy="12" r="2" />
        <circle cx="12" cy="12" r="1.5" />
        <path d="M7 6.8l3.6 4.4M7 17.2l3.6-4.4M13.5 12H17" />
      </>
    ),
  },
  arduino: {
    label: "HARDWARE",
    color: "var(--blue)",
    icon: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
      </>
    ),
  },
  courses: {
    label: "PATH",
    color: "var(--cyan)",
    icon: (
      <>
        <circle cx="5" cy="19" r="2" />
        <circle cx="12" cy="9" r="2" />
        <circle cx="19" cy="4" r="2" />
        <path d="M6.2 17.4l4.6-6.8M13.6 7.8l3.8-2.6" />
      </>
    ),
  },
  projects: {
    label: "SHOWCASE",
    color: "var(--violet)",
    icon: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="5" rx="1" />
        <rect x="13" y="10" width="8" height="11" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
      </>
    ),
  },
  explore: {
    label: "MAP",
    color: "var(--cyan)",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
  },
  process: {
    label: "PIPELINE",
    color: "var(--cyan)",
    icon: (
      <>
        <circle cx="4" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="20" cy="12" r="2" />
        <path d="M6 12h4M14 12h4" />
      </>
    ),
  },
  showcase: {
    label: "SHOWCASE",
    color: "var(--violet)",
    icon: (
      <>
        <rect x="5" y="9" width="14" height="11" rx="1.5" />
        <path d="M7 6h10M9 3h6" />
      </>
    ),
  },
  numbers: {
    label: "METRICS",
    color: "var(--blue)",
    icon: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  },
  voices: {
    label: "VOICES",
    color: "var(--violet)",
    icon: <path d="M4 5h16v11H9l-5 4z" />,
  },
  why: {
    label: "CORE",
    color: "var(--blue)",
    icon: <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />,
  },
  contact: {
    label: "TX",
    color: "var(--cyan)",
    icon: (
      <>
        <circle cx="12" cy="18" r="1.5" />
        <path d="M8.5 14.5a5 5 0 0 1 7 0M5.5 11.5a9 9 0 0 1 13 0M2.5 8.5a13 13 0 0 1 19 0" />
      </>
    ),
  },
};
const modeIds = Object.keys(modes);

// Circuit trace in a 40×1000 viewBox: vertical runs joined by horizontal jogs.
const runs: [number, number, number][] = [
  [0, 120, 20],
  [120, 260, 8],
  [260, 420, 32],
  [420, 580, 14],
  [580, 740, 28],
  [740, 900, 8],
  [900, 1000, 20],
];
const tracePath = runs
  .map(([a, b, x], i) => (i === 0 ? `M${x} ${a} V${b}` : `H${x} V${b}`))
  .join(" ");
const xAt = (y: number) => (runs.find(([a, b]) => y >= a && y <= b) ?? runs[0]!)[2];

/** Fixed glowing circuit trace that fills with scroll, morphs per section and lights a node at each section. */
export function SignalLine({ base = "home" }: { base?: string }) {
  const [p, setP] = useState(0);
  const [mode, setMode] = useState(base);
  const [nodes, setNodes] = useState<{ id: string; y: number }[]>([]);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      setNodes(
        modeIds.slice(1).flatMap((id) => {
          const el = document.getElementById(id);
          if (!el || h <= 0) return [];
          return [
            { id, y: Math.min(1, Math.max(0, (el.offsetTop - innerHeight * 0.5) / h)) * 1000 },
          ];
        }),
      );
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = document.documentElement.scrollHeight - innerHeight;
        setP(h > 0 ? Math.min(1, scrollY / h) : 0);
        let cur = base;
        for (const id of modeIds) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top < innerHeight * 0.5) cur = id;
        }
        setMode(cur);
      });
    };
    measure();
    onScroll();
    const t = setTimeout(measure, 1500);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", measure);
    };
  }, [base]);
  const [tag, setTag] = useState(true);
  useEffect(() => {
    setTag(true);
    const t = setTimeout(() => setTag(false), 1800);
    return () => clearTimeout(t);
  }, [mode]);
  const headY = p * 1000;
  const m = modes[mode]!;
  return (
    <div
      className="pointer-events-none fixed bottom-8 top-24 z-40 hidden w-10 start-1 md:block xl:start-3"
      dir="ltr"
    >
      <svg
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="sig" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--cyan)" />
            <stop offset=".5" stopColor="var(--blue)" />
            <stop offset="1" stopColor="var(--violet)" />
          </linearGradient>
        </defs>
        <path
          d={tracePath}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={tracePath}
          fill="none"
          stroke="url(#sig)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - p}
          style={{ filter: "drop-shadow(0 0 6px var(--cyan))" }}
        />
        {mode === "software" && (
          <path
            d={tracePath}
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="2 6"
            className="animate-dash-flow"
            opacity=".7"
          />
        )}
      </svg>
      {nodes.map((n) => {
        const lit = headY >= n.y - 2;
        return (
          <span
            key={n.id}
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-500"
            style={{
              left: xAt(n.y),
              top: `${n.y / 10}%`,
              background: lit ? modes[n.id]!.color : "var(--background)",
              borderColor: lit ? modes[n.id]!.color : "var(--border)",
              boxShadow: lit ? `0 0 10px ${modes[n.id]!.color}` : "none",
            }}
          />
        );
      })}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-[top,left] duration-150"
        style={{ top: `${headY / 10}%`, left: xAt(headY) }}
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full border bg-background/90 transition-colors duration-500"
          style={{ borderColor: m.color, boxShadow: `0 0 14px ${m.color}` }}
        >
          <svg
            key={mode}
            viewBox="0 0 24 24"
            className="h-4 w-4 animate-in zoom-in-50 fade-in duration-300"
            fill="none"
            stroke={m.color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {m.icon}
          </svg>
        </span>
        <span
          className="absolute left-9 top-1/2 whitespace-nowrap rounded border bg-background/95 px-2 py-0.5 font-mono text-[10px] tracking-widest backdrop-blur transition-all duration-500"
          style={{
            color: m.color,
            borderColor: m.color,
            opacity: tag ? 1 : 0,
            transform: `translate(${tag ? 0 : -8}px, -50%)`,
          }}
        >
          {m.label}
        </span>
      </div>
    </div>
  );
}

export function CursorGlow() {
  useEffect(() => {
    const el = document.getElementById("cursor-glow");
    if (!el || matchMedia("(pointer: coarse)").matches) return;
    const f = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    };
    addEventListener("pointermove", f, { passive: true });
    return () => removeEventListener("pointermove", f);
  }, []);
  return (
    <div
      id="cursor-glow"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[400px] w-[400px] rounded-full opacity-25 blur-3xl"
      style={{ background: "radial-gradient(circle, var(--blue), transparent 65%)" }}
    />
  );
}

export function SectionHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-14 max-w-3xl">
      <p className="reveal mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-cyan">
        <span className="relative grid h-3 w-3 place-items-center">
          <span className="absolute h-3 w-3 animate-ping rounded-full bg-cyan/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
        </span>
        {kicker}
      </p>
      <SplitWords
        key={title}
        text={title}
        className="font-display text-3xl leading-tight md:text-5xl"
      />
      {sub && <p className="reveal mt-5 text-lg text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative z-10 border-t bg-surface/60 px-5 pb-32 pt-14 sm:px-6 md:px-16 lg:pb-8">
      <div className="mx-auto grid max-w-[96rem] gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <PageLink to="/" className="flex items-center gap-3">
            <img src={logo} alt="Quantum logo" className="logo-glow h-14 w-14 object-contain" />
            <span
              className="font-display text-sm tracking-[0.3em] text-signal"
              style={{ fontFamily: "Michroma" }}
              dir="ltr"
            >
              QUANTUM
            </span>
          </PageLink>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{t.footer.tagline}</p>
          <p
            className="mt-4 font-mono text-xs tracking-[0.3em] text-cyan text-start rtl:text-right"
            dir="ltr"
          >
            SOFTWARE + AI + ARDUINO + EDUCATION
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-mono text-xs tracking-widest text-cyan">{t.footer.explore}</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {navPages.map((p) => (
              <li key={p.id}>
                <PageLink
                  to={p.to}
                  className="text-muted-foreground transition-colors hover:text-cyan"
                >
                  {t.nav[p.id]}
                </PageLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-mono text-xs tracking-widest text-cyan">{t.footer.connect}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan"
                dir="ltr"
              >
                Instagram {contact.instagramHandle}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-cyan" dir="ltr">
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="hover:text-cyan"
                dir="ltr"
              >
                {contact.phone}
              </a>
            </li>
            <li>{t.contact.location}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[96rem] flex-col items-center justify-between gap-3 border-t pt-6 font-mono text-xs text-muted-foreground sm:flex-row">
        <span>
          © {new Date().getFullYear()} QUANTUM · {t.footer.rights}
        </span>
        <button onClick={() => scrollToTop()} className="transition-colors hover:text-cyan">
          {t.footer.top} ↑
        </button>
      </div>
    </footer>
  );
}
