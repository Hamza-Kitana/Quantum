import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import pBoard from "@/assets/p-board.jpg";
import pKit from "@/assets/p-kit.jpg";
import pCam from "@/assets/p-cam.jpg";
import pRobot from "@/assets/p-robot.jpg";
import { useLang } from "@/lib/i18n";
import { contact } from "@/lib/content";
import { SectionHead } from "./Chrome";
import { useCounter, useInView, useScrollLock, useScrollProgress } from "./hooks";
import { PageLink } from "./PageTransition";

const imgs: Record<string, string> = { board: pBoard, kit: pKit, cam: pCam, robot: pRobot };
const byName = (files: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(files).map(([path, url]) => [path.split("/").pop()!.replace(".webp", ""), url]),
  );
const compImgs = byName(
  import.meta.glob<string>("../../assets/components/*.webp", { eager: true, import: "default" }),
);
const projImgs = byName(
  import.meta.glob<string>("../../assets/projects/*.webp", { eager: true, import: "default" }),
);
const wa = (msg: string) => `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(msg)}`;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Each trace runs from a board component to the microcontroller.
const traces: { d: string; comp: string }[] = [
  { d: "M52 75 H140 V150 H190", comp: "usb" },
  { d: "M62 192 H120 V170 H190", comp: "power" },
  { d: "M180 34 V110 H260 V140", comp: "digital" },
  { d: "M300 34 V100 H340 V140", comp: "digital" },
  { d: "M290 184 V226", comp: "analog" },
  { d: "M220 184 V226", comp: "analog" },
];
const leds: [number, number][] = [
  [150, 64],
  [150, 82],
  [150, 100],
  [365, 70],
];

function Part({
  k,
  active,
  lit,
  onHover,
  children,
}: {
  k: string;
  active: string | null;
  lit: boolean;
  onHover: (k: string | null) => void;
  children: ReactNode;
}) {
  const { t } = useLang();
  const on = active === k;
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={t.arduino.hotspots.find((h) => h.k === k)?.t ?? k}
      className="cursor-pointer outline-none"
      onMouseEnter={() => onHover(k)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(k)}
      onBlur={() => onHover(null)}
      onClick={() => onHover(k)}
      style={{
        filter: on
          ? "drop-shadow(0 0 8px var(--violet))"
          : lit
            ? "drop-shadow(0 0 5px var(--cyan))"
            : "none",
        transition: "filter .4s",
      }}
      stroke={on ? "var(--violet)" : lit ? "var(--cyan)" : "var(--border)"}
      strokeWidth="1.5"
    >
      {children}
    </g>
  );
}

function Board() {
  const { t } = useLang();
  const [ref, p] = useScrollProgress<HTMLDivElement>(0.9, 0.55);
  const [active, setActive] = useState<string | null>(null);
  const tp = traces.map((_, i) => clamp01(p * 1.8 - i * 0.12));
  const compLit = (k: string) =>
    traces.some((tr, i) => tr.comp === k && tp[i]! >= 1) ||
    (k === "mcu" && p > 0.55) ||
    (k === "led" && p > 0.8);
  const info = t.arduino.hotspots.find((h) => h.k === active);
  return (
    <div ref={ref}>
      <svg viewBox="0 0 400 260" className="w-full select-none">
        <rect
          x="10"
          y="10"
          width="380"
          height="240"
          rx="14"
          fill="oklch(0.2 0.08 262)"
          stroke="var(--cyan)"
          strokeOpacity={0.2 + p * 0.5}
        />
        {traces.map((tr, i) => (
          <path
            key={i}
            d={tr.d}
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="2"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - tp[i]!}
            style={{ filter: "drop-shadow(0 0 4px var(--cyan))" }}
          />
        ))}
        <Part k="digital" active={active} lit={compLit("digital")} onHover={setActive}>
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={120 + i * 18} y="20" width="10" height="14" fill="var(--background)" />
          ))}
        </Part>
        <Part k="analog" active={active} lit={compLit("analog")} onHover={setActive}>
          {Array.from({ length: 12 }, (_, i) => (
            <rect
              key={i}
              x={140 + i * 18}
              y="226"
              width="10"
              height="14"
              fill="var(--background)"
            />
          ))}
        </Part>
        <Part k="usb" active={active} lit={compLit("usb")} onHover={setActive}>
          <rect x="2" y="52" width="50" height="46" rx="3" fill="oklch(0.6 0.02 260)" />
          <rect x="10" y="62" width="30" height="26" rx="2" fill="oklch(0.45 0.02 260)" />
        </Part>
        <Part k="power" active={active} lit={compLit("power")} onHover={setActive}>
          <rect x="12" y="170" width="50" height="45" rx="4" fill="var(--background)" />
          <circle cx="37" cy="192" r="9" fill="oklch(0.25 0.02 260)" />
        </Part>
        <Part k="mcu" active={active} lit={compLit("mcu")} onHover={setActive}>
          <rect x="190" y="140" width="170" height="44" rx="4" fill="var(--background)" />
          <text
            x="275"
            y="167"
            textAnchor="middle"
            fill={compLit("mcu") ? "var(--cyan)" : "var(--muted-foreground)"}
            stroke="none"
            fontSize="11"
            fontFamily="JetBrains Mono"
          >
            QUANTUM-328P
          </text>
        </Part>
        <Part k="led" active={active} lit={compLit("led")} onHover={setActive}>
          {leds.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="5"
              fill={
                p > 0.6 + i * 0.07 ? (i === 3 ? "var(--violet)" : "var(--cyan)") : "var(--muted)"
              }
              style={{
                transition: "fill .4s",
                filter: p > 0.6 + i * 0.07 ? "drop-shadow(0 0 6px var(--cyan))" : "none",
              }}
            />
          ))}
          <text
            x="365"
            y="95"
            textAnchor="middle"
            fill="var(--cyan)"
            stroke="none"
            fontSize="9"
            fontFamily="JetBrains Mono"
            opacity={p > 0.8 ? 1 : 0.3}
          >
            ON
          </text>
        </Part>
      </svg>
      <div
        className="mt-4 flex min-h-[72px] items-start gap-3 rounded-xl border bg-background/60 p-4"
        aria-live="polite"
      >
        <span
          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${info ? "bg-violet glow-violet" : "bg-cyan animate-pulse-dot"}`}
        />
        {info ? (
          <p>
            <span className="font-semibold text-foreground">{info.t}</span>
            <span className="block text-sm text-muted-foreground">{info.d}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{t.arduino.boardHint}</p>
        )}
      </div>
    </div>
  );
}

function Inventory() {
  const { t } = useLang();
  const [g, setG] = useState(0);
  const group = t.arduino.groups[g]!;
  return (
    <div className="reveal mt-14 md:mt-20 md:rounded-2xl md:border md:bg-background/50 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
        <div>
          <h3 className="font-display text-2xl">{t.arduino.inventoryTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            {t.arduino.inventorySub}
          </p>
        </div>
        <div
          className="no-scrollbar -mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
          role="tablist"
        >
          {t.arduino.groups.map((gr, i) => (
            <button
              key={gr.name}
              role="tab"
              aria-selected={g === i}
              onClick={() => setG(i)}
              className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-all active:scale-95 md:py-1.5 ${g === i ? "border-cyan bg-cyan/10 text-cyan" : "text-muted-foreground hover:text-foreground"}`}
            >
              {gr.name}
            </button>
          ))}
        </div>
      </div>
      <div key={g} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {group.items.map((it, i) => (
          <a
            key={it.k}
            href={wa(t.arduino.waMsg + it.n)}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-xl border bg-surface animate-in fade-in slide-in-from-bottom-2 fill-mode-both transition-all active:scale-[0.97] hover:-translate-y-0.5 hover:border-cyan/60"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="relative aspect-square overflow-hidden bg-background">
              <img
                src={compImgs[it.k]}
                alt={it.n}
                loading="lazy"
                width={480}
                height={480}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span
                className="absolute end-2 top-2 h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]"
                title={t.arduino.available}
              />
            </div>
            <div className="p-3">
              <span className="block text-sm font-medium leading-snug text-foreground">{it.n}</span>
              <span className="mt-1 block font-mono text-[11px] text-muted-foreground">{it.s}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function Arduino() {
  const { t } = useLang();
  const [sel, setSel] = useState<number | null>(null);
  const p = sel !== null ? t.arduino.products[sel] : null;
  const closeRef = useRef<HTMLButtonElement>(null);
  useScrollLock(sel !== null);
  useEffect(() => {
    if (sel === null) return;
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setSel(null);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [sel]);
  return (
    <section
      id="arduino"
      className="relative overflow-hidden bg-surface px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36"
    >
      <div className="mx-auto max-w-[96rem]">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHead kicker={t.arduino.kicker} title={t.arduino.title} sub={t.arduino.sub} />
          <div className="reveal">
            <Board />
          </div>
        </div>
        <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {t.arduino.products.map((it, i) => (
            <button
              key={it.key}
              onClick={() => setSel(i)}
              className="reveal group relative w-[78%] shrink-0 snap-center overflow-hidden rounded-2xl border bg-background text-start transition-all active:scale-[0.98] hover:-translate-y-1 hover:border-cyan/60 hover:glow-cyan sm:w-auto sm:rounded-xl"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={imgs[it.key]}
                  alt={it.name}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute start-3 top-3 rounded-full glass px-3 py-1 font-mono text-[10px] tracking-wider text-cyan">
                  {it.cat}
                </span>
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{it.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{it.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-cyan">
                  {t.arduino.ask}{" "}
                  <span className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </button>
          ))}
        </div>
        <Inventory />
      </div>
      {p &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] grid place-items-end overflow-y-auto bg-background/80 backdrop-blur animate-in fade-in sm:place-items-center sm:p-4"
            onClick={() => setSel(null)}
            data-lenis-prevent
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={p.name}
              className="relative grid max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border bg-card pb-[env(safe-area-inset-bottom)] animate-in slide-in-from-bottom duration-300 sm:max-h-none sm:overflow-hidden sm:rounded-2xl sm:pb-0 sm:zoom-in-95 sm:slide-in-from-bottom-0 md:grid-cols-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                aria-hidden
                className="absolute start-1/2 top-2.5 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-white/40 sm:hidden rtl:translate-x-1/2"
              />
              <img
                src={imgs[p.key]}
                alt={p.name}
                className="aspect-[4/3] h-full w-full object-cover md:aspect-square"
              />
              <div className="flex flex-col p-6 md:p-7">
                <span className="font-mono text-xs text-cyan">
                  {p.cat} · <span className="text-foreground">● {t.arduino.available}</span>
                </span>
                <h3 className="mt-3 font-display text-2xl">{p.name}</h3>
                <p className="mt-4 text-muted-foreground">{p.desc}</p>
                <ul className="mt-5 flex-1 space-y-2 font-mono text-xs">
                  {p.specs.map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className="h-1 w-3 rounded-full bg-signal" />
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={wa(t.arduino.waMsg + p.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-signal px-6 py-3 text-center font-semibold text-primary-foreground"
                  >
                    {t.arduino.whatsapp} — {t.arduino.ask}
                  </a>
                  <div className="grid grid-cols-2 gap-3">
                    <PageLink
                      to="/contact"
                      onClick={() => setSel(null)}
                      className="rounded-full border px-4 py-3 text-center transition-colors hover:border-cyan hover:text-cyan"
                    >
                      {t.arduino.contactUs}
                    </PageLink>
                    <button
                      ref={closeRef}
                      onClick={() => setSel(null)}
                      className="rounded-full border px-4 py-3 transition-colors hover:border-foreground"
                    >
                      {t.arduino.close}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}

export function Courses() {
  const { t } = useLang();
  const [ref, p] = useScrollProgress<HTMLDivElement>(0.65, 0.45);
  const n = t.courses.items.length;
  return (
    <section id="courses" className="relative px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36">
      <div className="mx-auto max-w-5xl">
        <SectionHead kicker={t.courses.kicker} title={t.courses.title} sub={t.courses.sub} />
        <div ref={ref} className="relative pb-4 pt-12">
          <div className="absolute bottom-0 top-0 w-px bg-border start-6 md:start-1/2" />
          <div
            className="absolute top-0 w-px origin-top bg-signal start-6 md:start-1/2"
            style={{ height: "100%", transform: `scaleY(${p})`, boxShadow: "var(--glow-cyan)" }}
          />
          <span className="absolute top-0 -translate-y-1/2 rounded-full border bg-background px-3 py-1 font-mono text-[10px] tracking-widest text-cyan start-0 md:start-1/2 md:-translate-x-1/2 md:rtl:translate-x-1/2">
            {t.courses.start}
          </span>
          {t.courses.items.map((c, i) => {
            const on = p >= (i + 0.35) / n;
            return (
              <div
                key={c.name}
                className={`relative mb-10 flex ps-16 md:w-1/2 md:ps-0 ${i % 2 ? "md:ms-auto md:ps-14" : "md:pe-14"}`}
              >
                <span
                  className={`absolute top-6 grid h-12 w-12 place-items-center rounded-full border-2 bg-background font-mono text-sm transition-all duration-500 start-0 ${i % 2 ? "md:-start-6" : "md:start-auto md:-end-6"} ${on ? "scale-110 border-cyan text-cyan glow-cyan" : "border-border text-muted-foreground"}`}
                  dir="ltr"
                >
                  0{i + 1}
                </span>
                <div
                  className={`w-full rounded-xl border bg-card p-6 transition-all duration-700 ${on ? "translate-y-0 border-cyan/40 opacity-100" : "translate-y-6 opacity-40"}`}
                >
                  <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                    <span>
                      {t.courses.level}: <span className="text-cyan">{c.lvl}</span>
                    </span>
                    <span>
                      {c.w} {t.courses.weeks}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">{c.name}</h3>
                  <p className="mt-1 text-muted-foreground">{c.desc}</p>
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-signal transition-all duration-1000"
                      style={{ width: on ? `${(i + 1) * 20}%` : "0%" }}
                    />
                  </div>
                  <a
                    href={wa(t.courses.waMsg + c.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-4 inline-flex items-center gap-1 font-mono text-xs text-cyan"
                  >
                    {t.courses.ask}{" "}
                    <span className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
          <span
            className={`absolute bottom-0 translate-y-1/2 rounded-full border px-3 py-1 font-mono text-[10px] tracking-widest transition-all duration-500 start-0 md:start-1/2 md:-translate-x-1/2 md:rtl:translate-x-1/2 ${p >= 0.98 ? "border-violet bg-violet/20 text-foreground glow-violet" : "bg-background text-muted-foreground"}`}
          >
            {t.courses.finish}
          </span>
        </div>
      </div>
    </section>
  );
}

function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{ perspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5,
          y = (e.clientY - r.top) / r.height - 0.5;
        (e.currentTarget.firstChild as HTMLElement).style.transform =
          `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      }}
      onPointerLeave={(e) => {
        (e.currentTarget.firstChild as HTMLElement).style.transform = "";
      }}
    >
      {children}
    </div>
  );
}

export function Projects() {
  const { t } = useLang();
  const spans = ["md:col-span-2 md:row-span-2", "", "", "md:col-span-2", ""];
  return (
    <section
      id="projects"
      className="relative bg-surface px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36"
    >
      <div className="mx-auto max-w-[96rem]">
        <SectionHead kicker={t.projects.kicker} title={t.projects.title} />
        <div className="grid auto-rows-[240px] gap-5 md:grid-cols-4">
          {t.projects.items.map((p, i) => (
            <Tilt key={p.name} className={`reveal ${spans[i]}`}>
              <article
                className="group relative h-full overflow-hidden rounded-2xl border bg-background transition-transform duration-300 ease-out"
                style={{ transformStyle: "preserve-3d" }}
              >
                <img
                  src={projImgs[p.k]}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <span
                  className="absolute end-5 top-4 font-display text-5xl text-foreground/15 transition-colors group-hover:text-cyan/40"
                  dir="ltr"
                >
                  0{i + 1}
                </span>
                <div
                  className="relative flex h-full flex-col justify-end p-6"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <span className="flex flex-wrap items-center gap-x-3 font-mono text-xs">
                    <span className="text-cyan">{p.tag}</span>
                    <span className="text-muted-foreground">{p.meta}</span>
                  </span>
                  <h3 className="mt-2 font-display text-xl md:text-2xl">{p.name}</h3>
                  <p className="mt-2 overflow-hidden text-sm text-muted-foreground transition-all duration-500 md:max-h-0 md:group-hover:max-h-28">
                    {p.desc}
                  </p>
                </div>
              </article>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyItem({
  i,
  t: title,
  d,
  n,
  s: unit,
}: {
  i: number;
  t: string;
  d: string;
  n: number;
  s: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const pct = useCounter(n, inView);
  return (
    <div
      ref={ref}
      className="reveal group grid items-baseline gap-4 border-b py-8 transition-colors hover:bg-surface/50 md:grid-cols-[120px_1fr_200px] md:px-4"
    >
      <span className="font-mono text-sm text-cyan" dir="ltr">
        0{i + 1}
      </span>
      <div>
        <h3 className="font-display text-2xl transition-transform duration-500 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 md:text-3xl">
          {title}
        </h3>
        <p className="mt-2 max-w-xl text-muted-foreground">{d}</p>
      </div>
      <span className="font-display text-4xl text-signal md:text-end" dir="ltr">
        {pct}
        {unit}
      </span>
    </div>
  );
}

export function Why() {
  const { t } = useLang();
  return (
    <section id="why" className="px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36">
      <div className="mx-auto max-w-[96rem]">
        <SectionHead kicker={t.why.kicker} title={t.why.title} sub={t.why.sub} />
        <div className="border-t">
          {t.why.items.map((w, i) => (
            <WhyItem key={w.t} i={i} {...w} />
          ))}
        </div>
      </div>
    </section>
  );
}

type Field = "name" | "email" | "message";

export function Contact() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const form = useRef<HTMLFormElement>(null);
  const c = t.contact;
  const items = [
    { l: c.labels.whatsapp, v: contact.phone, h: wa(c.waHello) },
    { l: c.labels.phone, v: contact.phone, h: `tel:${contact.phone.replace(/\s/g, "")}` },
    { l: c.labels.email, v: contact.email, h: `mailto:${contact.email}` },
    { l: c.labels.location, v: c.location, h: "https://maps.google.com/?q=Amman" },
  ];
  const validate = () => {
    const d = new FormData(form.current!);
    const v = {
      name: String(d.get("name") ?? "").trim(),
      email: String(d.get("email") ?? "").trim(),
      message: String(d.get("message") ?? "").trim(),
    };
    const e: Partial<Record<Field, string>> = {};
    if (!v.name) e.name = c.errName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = c.errEmail;
    if (v.message.length < 10) e.message = c.errMessage;
    setErrors(e);
    return Object.keys(e).length ? null : v;
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSent(true);
    form.current!.reset();
  };
  const sendWhatsapp = () => {
    const v = validate();
    if (!v) return;
    open(wa(`${c.waHello}\n${v.name} — ${v.email}\n\n${v.message}`), "_blank", "noreferrer");
  };
  const fields: [Field, string, string][] = [
    ["name", c.name, "text"],
    ["email", c.email, "email"],
  ];
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-surface px-5 py-20 sm:px-6 sm:py-28 grid-bg md:px-16 md:py-36"
    >
      <div className="mx-auto max-w-[96rem]">
        <SectionHead kicker={c.kicker} title={c.title} sub={c.sub} />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <a
              href={contact.instagram}
              target="_blank"
              rel="noreferrer"
              className="reveal group block rounded-2xl bg-signal p-[1px]"
            >
              <span className="flex w-full items-center gap-5 rounded-2xl bg-background p-6 transition-colors group-hover:bg-background/80">
                <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-violet/40 bg-violet/10">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-9 w-9"
                    fill="none"
                    stroke="url(#ig)"
                    strokeWidth="1.8"
                  >
                    <defs>
                      <linearGradient id="ig">
                        <stop stopColor="var(--cyan)" />
                        <stop offset="1" stopColor="var(--violet)" />
                      </linearGradient>
                    </defs>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="var(--violet)" />
                  </svg>
                  <span className="absolute -end-1 -top-1 h-3 w-3 rounded-full bg-cyan animate-pulse-dot" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm text-muted-foreground">{c.follow}</span>
                  <span className="block font-display text-xl text-signal" dir="ltr">
                    {contact.instagramHandle}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{c.followSub}</span>
                </span>
                <span className="text-cyan transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                  →
                </span>
              </span>
            </a>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((it) => (
                <a
                  key={it.l}
                  href={it.h}
                  target="_blank"
                  rel="noreferrer"
                  className="reveal rounded-xl border bg-background/70 p-5 transition-colors hover:border-cyan/60"
                >
                  <span className="font-mono text-xs tracking-widest text-cyan">{it.l}</span>
                  <span
                    className="mt-2 block break-all"
                    dir={it.l === c.labels.location ? undefined : "ltr"}
                  >
                    {it.v}
                  </span>
                </a>
              ))}
            </div>
          </div>
          <form
            ref={form}
            onSubmit={submit}
            noValidate
            className="reveal space-y-4 rounded-2xl border glass p-7"
            onInput={() => sent && setSent(false)}
          >
            {fields.map(([n, l, ty]) => (
              <label key={n} className="block">
                <span className="mb-1.5 block text-sm text-muted-foreground">{l}</span>
                <input
                  name={n}
                  type={ty}
                  maxLength={120}
                  aria-invalid={!!errors[n]}
                  dir={n === "email" ? "ltr" : undefined}
                  className={`w-full rounded-lg border bg-background/70 px-4 py-3 outline-none transition-colors focus:border-cyan ${errors[n] ? "border-destructive" : ""}`}
                />
                {errors[n] && (
                  <span className="mt-1 block text-xs text-destructive">{errors[n]}</span>
                )}
              </label>
            ))}
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">{c.message}</span>
              <textarea
                name="message"
                rows={5}
                maxLength={2000}
                aria-invalid={!!errors.message}
                className={`w-full resize-none rounded-lg border bg-background/70 px-4 py-3 outline-none transition-colors focus:border-cyan ${errors.message ? "border-destructive" : ""}`}
              />
              {errors.message && (
                <span className="mt-1 block text-xs text-destructive">{errors.message}</span>
              )}
            </label>
            <button className="w-full rounded-full bg-signal py-3.5 font-semibold text-primary-foreground glow-cyan transition-transform hover:scale-[1.01]">
              {c.send}
            </button>
            <button
              type="button"
              onClick={sendWhatsapp}
              className="w-full rounded-full border py-3 text-sm transition-colors hover:border-cyan hover:text-cyan"
            >
              {c.viaWhatsapp}
            </button>
            {sent && (
              <p className="text-center text-sm text-cyan animate-in fade-in" role="status">
                {c.sent}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
