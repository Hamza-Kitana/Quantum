import { useEffect, useRef, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";

const reduced = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Runs `update(rect, vh)` on scroll/resize, throttled to one call per frame. */
export function useScrollFrame(
  ref: React.RefObject<HTMLElement | null>,
  update: (r: DOMRect, vh: number) => void,
) {
  const fn = useRef(update);
  fn.current = update;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      fn.current(el.getBoundingClientRect(), innerHeight);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
    };
  }, [ref]);
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

/**
 * Section wipes in edge-to-edge: a glowing circuit curtain sweeps across the full
 * width, the section follows right behind it, and a light edge rides the front.
 * Odd sections enter from the right, even ones from the left.
 */
export function Reveal({ children, n, label }: { children: ReactNode; n: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const move = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const edge = useRef<HTMLSpanElement>(null);
  const fromRight = n % 2 === 1;
  useScrollFrame(ref, (r, vh) => {
    if (reduced()) return;
    // Phones scroll in short flicks, so the wipe completes over less distance there.
    const raw = clamp01((vh - r.top) / (vh * (innerWidth < 768 ? 0.5 : 0.8)));
    const front = easeInOut(clamp01(raw * 1.3));
    const back = easeInOut(clamp01(raw * 1.3 - 0.3));
    // Fractions measured from the entry side; converted to inset() for each direction.
    const side = (a: number, b: number) =>
      fromRight ? `inset(0 ${pct(a)} 0 ${pct(1 - b)})` : `inset(0 ${pct(1 - b)} 0 ${pct(a)})`;
    if (back >= 1) {
      clip.current!.style.clipPath = "none";
      move.current!.style.transform = "none";
    } else {
      clip.current!.style.clipPath = side(0, back);
      const e = 1 - back;
      move.current!.style.transform = `translate3d(${(fromRight ? 1 : -1) * e * 140}px, 0, 0)`;
    }
    curtain.current!.style.clipPath = side(back, front);
    const mid = (back + front) / 2;
    tag.current!.style.left = pct(fromRight ? 1 - mid : mid);
    tag.current!.style.opacity = String(front > 0 && back < 1 ? 1 : 0);
    edge.current!.style.left = pct(fromRight ? 1 - front : front);
    edge.current!.style.opacity = front > 0.01 && front < 0.995 ? "1" : "0";
  });
  return (
    <div ref={ref} className="relative overflow-x-clip">
      <div ref={clip}>
        <div ref={move} className="will-change-transform">
          {children}
        </div>
      </div>
      <div
        ref={curtain}
        aria-hidden
        className="wipe-curtain pointer-events-none absolute inset-0 z-20"
      >
        <div
          ref={tag}
          className="wipe-label absolute flex w-max flex-col items-center gap-2"
          style={{ top: "min(40vh, 40%)" }}
        >
          <span className="font-display text-7xl leading-none text-foreground/90 md:text-9xl">
            0{n}
          </span>
          <span className="font-mono text-xs tracking-[0.4em] text-cyan" dir="auto">
            {label}
          </span>
        </div>
      </div>
      <span
        ref={edge}
        aria-hidden
        className="wipe-edge pointer-events-none absolute inset-y-0 z-30 w-[2px]"
      />
    </div>
  );
}

type Variant = { label: string; color: string; paths: string[]; nodes?: [number, number][] };
const W = 1200,
  H = 120;
const square = (() => {
  let d = "M0 60 H120";
  let up = true;
  for (let x = 120; x < 1080; x += 60) {
    d += ` V${up ? 28 : 92} H${x + 60}`;
    up = !up;
  }
  return d + " V60 H1200";
})();
const sine = (() => {
  let d = "M0 60";
  for (let x = 0; x <= W; x += 10)
    d += ` L${x} ${60 + Math.sin(x / 38) * 34 * Math.sin((x / W) * Math.PI)}`;
  return d;
})();

const variants: Record<string, Variant> = {
  about: { label: "BOOT", color: "var(--cyan)", paths: ["M0 60 H520 L560 30 H640 L680 60 H1200"] },
  software: { label: "</> CODE", color: "var(--cyan)", paths: [square] },
  ai: {
    label: "NEURAL",
    color: "var(--violet)",
    paths: [
      "M0 60 C300 60 400 60 600 60 C800 60 900 60 1200 60",
      "M0 15 C300 15 420 60 600 60 C780 60 900 105 1200 105",
      "M0 105 C300 105 420 60 600 60 C780 60 900 15 1200 15",
      "M150 35 C350 35 450 60 600 60",
      "M600 60 C750 60 850 85 1050 85",
    ],
    nodes: [
      [150, 35],
      [300, 15],
      [300, 105],
      [900, 15],
      [900, 105],
      [1050, 85],
    ],
  },
  arduino: {
    label: "HARDWARE",
    color: "var(--blue)",
    paths: [
      "M0 40 H380 L420 60 H780 L820 40 H1200",
      "M0 60 H1200",
      "M0 80 H380 L420 60 M780 60 L820 80 H1200",
    ],
    nodes: [
      [380, 40],
      [380, 80],
      [820, 40],
      [820, 80],
      [200, 60],
      [1000, 60],
    ],
  },
  courses: {
    label: "PATH",
    color: "var(--cyan)",
    paths: ["M0 90 C200 90 250 30 450 30 S700 90 900 90 S1100 30 1200 30"],
    nodes: [
      [0, 90],
      [450, 30],
      [900, 90],
      [1200, 30],
    ],
  },
  projects: {
    label: "SHOWCASE",
    color: "var(--violet)",
    paths: [
      "M0 60 H470 M730 60 H1200",
      "M470 20 H500 M470 20 V50 M730 20 H700 M730 20 V50 M470 100 H500 M470 100 V70 M730 100 H700 M730 100 V70",
    ],
  },
  why: {
    label: "CORE",
    color: "var(--blue)",
    paths: ["M0 60 H1200", "M0 30 H300 L340 60 M860 60 L900 90 H1200"],
  },
  contact: { label: "TX", color: "var(--cyan)", paths: [sine] },
};

/** Circuit "bridge" between two sections — drawn by scroll, with a pulse riding the main trace. */
export function Divider({
  to,
  n,
  label,
}: {
  to: keyof typeof variants;
  n: number;
  label?: string;
}) {
  const { t } = useLang();
  const v = variants[to]!;
  const ref = useRef<HTMLDivElement>(null);
  const lit = useRef<(SVGPathElement | null)[]>([]);
  const head = useRef<HTMLSpanElement>(null);
  const chip = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLSpanElement | null)[]>([]);
  useScrollFrame(ref, (r, vh) => {
    const p = reduced() ? 1 : clamp01((vh * 0.95 - r.top) / (r.height + vh * 0.45));
    lit.current.forEach((path, i) => {
      if (path) path.style.strokeDashoffset = String(1 - clamp01(p * 1.25 - i * 0.06));
    });
    const main = lit.current[0];
    if (main && head.current) {
      const len = main.getTotalLength();
      const pt = main.getPointAtLength(len * clamp01(p * 1.25));
      head.current.style.left = `${(pt.x / W) * 100}%`;
      head.current.style.top = `${(pt.y / H) * 100}%`;
      head.current.style.opacity = p > 0 && p < 0.8 ? "1" : "0";
    }
    chip.current?.classList.toggle("on", p > 0.4);
    v.nodes?.forEach(([x], i) => nodes.current[i]?.classList.toggle("on", p * 1.25 >= x / W));
  });
  const nav = t.nav as Record<string, string>;
  const name = label ?? nav[to] ?? (to === "why" ? t.why.kicker.split("/")[1]?.trim() : to);
  return (
    <div
      ref={ref}
      aria-hidden
      className="relative z-10 h-20 overflow-hidden sm:h-28 md:h-36"
      dir="ltr"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {v.paths.map((d, i) => (
          <path
            key={`b${i}`}
            d={d}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={to === "courses" ? "2 6" : undefined}
          />
        ))}
        {v.paths.map((d, i) => (
          <path
            key={`l${i}`}
            ref={(el) => {
              lit.current[i] = el;
            }}
            d={d}
            fill="none"
            stroke={v.color}
            strokeWidth={i === 0 ? 2 : 1.25}
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            style={{ filter: `drop-shadow(0 0 6px ${v.color})` }}
          />
        ))}
      </svg>
      {v.nodes?.map(([x, y], i) => (
        <span
          key={i}
          ref={(el) => {
            nodes.current[i] = el;
          }}
          className="divider-node absolute h-2.5 w-2.5 rounded-full border"
          style={{
            left: `${(x / W) * 100}%`,
            top: `${(y / H) * 100}%`,
            ["--c" as string]: v.color,
          }}
        />
      ))}
      <span
        ref={head}
        className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity duration-300"
        style={{ boxShadow: `0 0 12px 3px ${v.color}, 0 0 30px 6px ${v.color}` }}
      />
      <div
        ref={chip}
        className="divider-chip absolute left-1/2 top-1/2 flex items-center gap-3 rounded-full border bg-background/90 px-4 py-2 font-mono text-[11px] tracking-[0.2em] backdrop-blur"
        style={{ ["--c" as string]: v.color }}
      >
        <span className="relative grid h-2 w-2 place-items-center">
          <span
            className="absolute h-4 w-4 animate-ping rounded-full opacity-40"
            style={{ background: v.color }}
          />
          <span className="h-2 w-2 rounded-full" style={{ background: v.color }} />
        </span>
        <span style={{ color: v.color }}>0{n}</span>
        <span className="hidden text-foreground sm:inline" dir="auto">
          {name}
        </span>
        <span className="text-muted-foreground">{v.label}</span>
      </div>
    </div>
  );
}

/** Heading that rises word-by-word out of a mask with a blur-to-sharp settle. */
export function SplitWords({
  text,
  className,
  as: Tag = "h2",
  ready,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2";
  ready?: boolean;
}) {
  const words = text.split(" ");
  // `ready` given → caller controls the reveal instead of the scroll observer.
  const mode = ready === undefined ? "reveal-words" : `split-words ${ready ? "in" : ""}`;
  return (
    <Tag className={`${mode} ${className ?? ""}`} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <span className="word inline-block" style={{ transitionDelay: `${i * 80}ms` }}>
            {w}
          </span>
          {i < words.length - 1 && "\u00a0"}
        </span>
      ))}
    </Tag>
  );
}
