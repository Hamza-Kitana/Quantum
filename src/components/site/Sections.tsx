import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { SectionHead } from "./Chrome";

export function About() {
  const { t } = useLang();
  return (
    <section id="about" className="relative px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36">
      <div className="mx-auto max-w-[96rem]">
        <SectionHead kicker={t.about.kicker} title={t.about.title} />
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <p className="reveal text-2xl leading-relaxed md:text-3xl">{t.about.body}</p>
          <div className="space-y-6">
            {[
              [t.about.vision, t.about.visionText],
              [t.about.mission, t.about.missionText],
            ].map(([h, b], i) => (
              <div
                key={h}
                className="reveal border-s-2 border-cyan/50 ps-5"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <h3 className="font-mono text-sm tracking-widest text-cyan">{h}</h3>
                <p className="mt-2 text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 overflow-hidden border-y py-6" dir="ltr">
          <div className="flex w-max animate-marquee gap-12 font-display text-4xl leading-[1.4] md:text-6xl md:leading-[1.4]">
            {[...t.about.pillars, ...t.about.pillars, ...t.about.pillars, ...t.about.pillars].map(
              (p, i) => (
                <span key={i} className={i % 2 ? "text-signal" : "text-foreground/15"}>
                  {p} ✦
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Typed({ lines }: { lines: string[] }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    const full = lines.join("\n");
    let i = 0;
    setOut("");
    const id = setInterval(() => {
      i += 2;
      setOut(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [lines]);
  return (
    <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-cyan md:text-base">
      {out}
      <span className="animate-blink">▍</span>
    </pre>
  );
}

export function Software() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const items = t.software.items;
  const cur = items[active]!;
  return (
    <section
      id="software"
      className="relative overflow-hidden bg-surface px-5 py-20 sm:px-6 sm:py-28 grid-bg md:px-16 md:py-36"
    >
      <div className="mx-auto max-w-[96rem]">
        <SectionHead kicker={t.software.kicker} title={t.software.title} sub={t.software.sub} />
        <div className="grid gap-8 lg:grid-cols-2">
          <ul className="space-y-2">
            {items.map((it, i) => (
              <li key={it.name}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`reveal group flex w-full items-center gap-5 rounded-lg border px-5 py-5 text-start transition-all ${active === i ? "border-cyan/60 bg-background/60 glow-cyan" : "border-transparent hover:border-border"}`}
                >
                  <span className="font-mono text-xs text-cyan" dir="ltr">
                    0{i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="block text-xl font-semibold">{it.name}</span>
                    <span className="block text-sm text-muted-foreground">{it.desc}</span>
                  </span>
                  <span
                    className={`font-mono text-cyan transition-transform ${active === i ? "translate-x-0 opacity-100" : "opacity-0"}`}
                  >
                    {"</>"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div
            className="reveal overflow-hidden rounded-xl border bg-background/80 shadow-2xl"
            dir="ltr"
          >
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-destructive/70" />
              <span className="h-3 w-3 rounded-full bg-blue/70" />
              <span className="h-3 w-3 rounded-full bg-cyan/70" />
              <span className="ms-3 font-mono text-xs text-muted-foreground">
                quantum://{cur.name.toLowerCase().replace(/\s/g, "-")}.ts
              </span>
            </div>
            <div className="flex min-h-[260px] gap-4 p-6">
              <div className="select-none font-mono text-sm leading-7 text-muted-foreground/40">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n}>{n}</div>
                ))}
              </div>
              <Typed lines={cur.code} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const nodePos: [number, number][] = [
  [50, 12],
  [86, 38],
  [74, 84],
  [26, 84],
  [14, 38],
];

export function AI() {
  const { t } = useLang();
  const [hover, setHover] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ x: 50, y: 50 });
  const hidden: [number, number][] = Array.from({ length: 9 }, (_, i): [number, number] => [
    32 + (i % 3) * 18,
    34 + Math.floor(i / 3) * 16,
  ]);
  return (
    <section
      id="ai"
      className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.6 0.24 295 / 25%), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[96rem]">
        <div className="text-center [&>div]:mx-auto">
          <SectionHead kicker={t.ai.kicker} title={t.ai.title} sub={t.ai.sub} />
        </div>
        <div
          ref={wrap}
          className="relative mx-auto aspect-square max-w-2xl md:aspect-[4/3]"
          onPointerMove={(e) => {
            const r = wrap.current!.getBoundingClientRect();
            setM({
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top) / r.height) * 100,
            });
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {nodePos.map(([x, y], i) =>
              hidden.map(([hx, hy], j) => (
                <line
                  key={`${i}-${j}`}
                  x1={x}
                  y1={y}
                  x2={hx}
                  y2={hy}
                  stroke={hover === i ? "var(--violet)" : "var(--cyan)"}
                  strokeOpacity={hover === i ? 0.7 : 0.12}
                  strokeWidth={hover === i ? 0.35 : 0.15}
                />
              )),
            )}
            {hidden.map(([hx, hy], j) => {
              const d = Math.hypot(hx - m.x, hy - m.y);
              return (
                <circle
                  key={j}
                  cx={hx}
                  cy={hy}
                  r={d < 15 ? 1.6 : 1}
                  fill={d < 15 ? "var(--violet)" : "var(--blue)"}
                  style={{ transition: "all .3s" }}
                />
              );
            })}
            <circle cx={m.x} cy={m.y} r="10" fill="var(--violet)" opacity=".08" />
          </svg>
          {t.ai.items.map((it, i) => (
            <button
              key={it.name}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              className="reveal absolute w-40 -translate-x-1/2 -translate-y-1/2 text-center md:w-52"
              style={{
                left: `${nodePos[i]![0]}%`,
                top: `${nodePos[i]![1]}%`,
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <span
                className={`mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full border-2 transition-all ${hover === i ? "scale-125 border-violet bg-violet/30 glow-violet" : "border-cyan bg-background glow-cyan"}`}
              >
                <span className="h-2 w-2 rounded-full bg-cyan" />
              </span>
              <span className="block text-sm font-semibold md:text-base">{it.name}</span>
              <span
                className={`block text-xs text-muted-foreground transition-opacity md:text-sm ${hover === i ? "opacity-100" : "opacity-0 md:opacity-60"}`}
              >
                {it.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
