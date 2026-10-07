import { useState, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { SectionHead } from "./Chrome";
import { Icon } from "./CourseCatalog";
import { cats } from "./catalogLook";

const robot = (
  <>
    <rect x="5" y="8" width="14" height="11" rx="3" />
    <path d="M12 4v4M9 13h.01M15 13h.01M9.5 16.5h5M3 12v3M21 12v3" />
  </>
);

const projectCats: Record<string, { color: string; icon: ReactNode }> = {
  ai: cats["ai"]!,
  xr: cats["xr"]!,
  vr: { color: "var(--blue)", icon: cats["xr"]!.icon },
  robotics: { color: "var(--blue)", icon: robot },
  arduino: { color: "var(--cyan)", icon: cats["hardware"]!.icon },
  programming: cats["programming"]!,
  gamedev: cats["engines"]!,
};

export function StudentProjects() {
  const { t } = useLang();
  const s = t.projects.student;
  const [cat, setCat] = useState("all");
  const list = cat === "all" ? s.items : s.items.filter((it) => it.cat === cat);
  const tabs = [{ k: "all", n: s.all }, ...s.cats];
  const catName = (k: string) => s.cats.find((x) => x.k === k)?.n ?? k;
  return (
    <section
      id="student-projects"
      className="relative overflow-hidden bg-surface px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 40% at 10% 10%, color-mix(in oklab, var(--blue) 14%, transparent), transparent 70%), radial-gradient(40% 35% at 90% 90%, color-mix(in oklab, var(--violet) 12%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[96rem]">
        <SectionHead kicker={s.kicker} title={s.title} sub={s.sub} />
        <div className="reveal -mx-5 overflow-x-auto px-5 no-scrollbar md:mx-0 md:px-0">
          <div
            className="glass inline-flex gap-1 rounded-full p-1.5"
            role="tablist"
            aria-label={s.title}
          >
            {tabs.map((tb) => {
              const on = cat === tb.k;
              return (
                <button
                  key={tb.k}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setCat(tb.k)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-all duration-300 active:scale-95 ${on ? "bg-signal font-semibold text-primary-foreground glow-cyan" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
                >
                  {tb.n}
                </button>
              );
            })}
          </div>
        </div>

        <div key={cat} className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {list.map((it, j) => {
            const m = projectCats[it.cat]!;
            return (
              <article
                key={it.name}
                className={`group relative flex min-h-[20rem] flex-col overflow-hidden rounded-3xl border bg-card/60 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 transition-transform hover:-translate-y-1.5 ${cat === "all" && (j === 0 || j === list.length - 1) ? "xl:col-span-2" : ""}`}
                style={{ animationDelay: `${j * 60}ms` }}
              >
                <div
                  className="relative h-32 overflow-hidden border-b grid-bg"
                  style={{
                    background: `radial-gradient(80% 120% at 50% 0%, color-mix(in oklab, ${m.color} 28%, transparent), transparent 75%)`,
                  }}
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 opacity-30 transition-all duration-700 group-hover:scale-125 group-hover:opacity-60"
                    fill="none"
                    stroke={m.color}
                    strokeWidth="1"
                    style={{ filter: `drop-shadow(0 0 12px ${m.color})` }}
                  >
                    {m.icon}
                  </svg>
                  <span
                    className="glass absolute start-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-widest"
                    style={{ color: m.color }}
                  >
                    <Icon color={m.color} className="h-3.5 w-3.5">
                      {m.icon}
                    </Icon>
                    {catName(it.cat)}
                  </span>
                </div>
                <div className="relative flex flex-1 flex-col p-6 md:p-7">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(90% 70% at 100% 100%, color-mix(in oklab, ${m.color} 14%, transparent), transparent 70%)`,
                    }}
                  />
                  <h3 className="relative font-display text-xl leading-snug md:text-2xl">
                    {it.name}
                  </h3>
                  <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {it.desc}
                  </p>
                  <div className="relative mt-6 flex flex-wrap gap-2 rtl:justify-end" dir="ltr">
                    {it.tags.map((tg) => (
                      <span
                        key={tg}
                        className="rounded-full border px-3 py-1 font-mono text-[11px] text-muted-foreground transition-colors group-hover:text-foreground"
                        style={{ borderColor: `color-mix(in oklab, ${m.color} 35%, transparent)` }}
                      >
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100 rtl:origin-right"
                  style={{ background: m.color, boxShadow: `0 0 12px ${m.color}` }}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const journeyIcons = [
  <path
    key="l"
    d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20M8 7h8M8 11h6"
  />,
  <path
    key="b"
    d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8M14.7 6.3L13 4.6 3 14.6l3 3M14.7 6.3l3-3"
  />,
  <path
    key="r"
    d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2M12 15l-3-3a12 12 0 0 1 11-9 12 12 0 0 1-8 12zM9 12H5l2-4h4M12 15v4l4-2v-4"
  />,
];
const journeyColors = ["var(--cyan)", "var(--blue)", "var(--violet)"];

export function Journey() {
  const { t } = useLang();
  const j = t.courses.journey;
  return (
    <section id="journey" className="relative px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36">
      <div className="mx-auto max-w-[96rem]">
        <SectionHead kicker={j.kicker} title={j.title} />
        <div className="relative grid gap-5 md:grid-cols-3">
          <span
            aria-hidden
            className="absolute inset-x-[16%] top-12 hidden h-px bg-gradient-to-r from-cyan via-blue to-violet opacity-50 rtl:bg-gradient-to-l md:block"
          />
          {j.steps.map((st, i) => {
            const c = journeyColors[i]!;
            return (
              <div
                key={st.t}
                className="reveal group relative flex flex-col items-center text-center"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <span
                  className="relative z-10 grid h-24 w-24 place-items-center rounded-full border bg-background transition-transform duration-500 group-hover:scale-110"
                  style={{
                    borderColor: `color-mix(in oklab, ${c} 55%, transparent)`,
                    boxShadow: `0 0 40px -10px ${c}`,
                  }}
                >
                  <Icon color={c} className="h-9 w-9">
                    {journeyIcons[i]}
                  </Icon>
                  <span
                    className="absolute -top-1 right-0 grid h-8 w-8 place-items-center rounded-full font-mono text-xs font-semibold text-primary-foreground"
                    style={{ background: c }}
                    dir="ltr"
                  >
                    0{i + 1}
                  </span>
                </span>
                <div
                  className="glass mt-6 w-full flex-1 rounded-3xl p-7 transition-colors duration-500 group-hover:border-[color:var(--c)]"
                  style={{ ["--c" as string]: c }}
                >
                  <h3 className="font-display text-3xl" style={{ color: c }}>
                    {st.t}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{st.d}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type Kind = "engine" | "lang" | "hw" | "xr" | "d3" | "ai" | "dev" | "cloud";

const kindLook: Record<Kind, { color: string; icon: ReactNode }> = {
  engine: cats["engines"]!,
  lang: cats["programming"]!,
  hw: { color: "var(--blue)", icon: cats["hardware"]!.icon },
  xr: cats["xr"]!,
  d3: {
    color: "var(--violet)",
    icon: <path d="M12 2l9 5v10l-9 5-9-5V7zM12 22V12M21 7l-9 5-9-5" />,
  },
  ai: { color: "var(--violet)", icon: cats["ai"]!.icon },
  dev: {
    color: "var(--blue)",
    icon: (
      <>
        <circle cx="6" cy="5" r="2" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="9" r="2" />
        <path d="M6 7v10M18 11c0 4-6 3-11.2 6.4" />
      </>
    ),
  },
  cloud: {
    color: "var(--cyan)",
    icon: <path d="M7 18a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5A3.75 3.75 0 0 1 17.5 18z" />,
  },
};

const tools: [string, Kind][] = [
  ["Unity", "engine"],
  ["Unreal Engine", "engine"],
  ["Python", "lang"],
  ["C#", "lang"],
  ["Arduino", "hw"],
  ["Meta Quest", "xr"],
  ["OpenXR", "xr"],
  ["Blender", "d3"],
  ["TensorFlow", "ai"],
  ["PyTorch", "ai"],
  ["OpenAI", "ai"],
  ["GitHub", "dev"],
  ["Firebase", "cloud"],
];

export function Tools() {
  const { t } = useLang();
  const s = t.courses.tools;
  return (
    <section
      id="tools"
      className="relative overflow-hidden bg-surface px-5 py-20 grid-bg sm:px-6 sm:py-28 md:px-16 md:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 45% at 50% 100%, color-mix(in oklab, var(--cyan) 12%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[96rem]">
        <div className="text-center [&>div]:mx-auto">
          <SectionHead kicker={s.kicker} title={s.title} sub={s.sub} />
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {tools.map(([name, kind], i) => {
            const m = kindLook[kind];
            return (
              <div
                key={name}
                className="reveal group relative flex w-[calc(50%-0.375rem)] items-center gap-3 overflow-hidden rounded-2xl border bg-card/70 p-3 backdrop-blur-sm sm:gap-4 sm:p-4 transition-transform duration-500 hover:-translate-y-1 sm:w-60 md:p-5"
                style={{ transitionDelay: `${(i % 5) * 70}ms` }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(100% 120% at 0% 50%, color-mix(in oklab, ${m.color} 20%, transparent), transparent 70%)`,
                    boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${m.color} 55%, transparent), 0 20px 40px -24px ${m.color}`,
                  }}
                />
                <span
                  className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform sm:h-12 sm:w-12 duration-500 group-hover:-rotate-6 group-hover:scale-110"
                  style={{
                    border: `1px solid color-mix(in oklab, ${m.color} 45%, transparent)`,
                    background: `linear-gradient(145deg, color-mix(in oklab, ${m.color} 24%, transparent), transparent)`,
                  }}
                >
                  <Icon color={m.color} className="h-5 w-5 sm:h-6 sm:w-6">
                    {m.icon}
                  </Icon>
                </span>
                <span className="relative min-w-0">
                  <span
                    className="block font-semibold leading-snug rtl:text-right sm:truncate md:text-lg"
                    dir="ltr"
                  >
                    {name}
                  </span>
                  <span
                    className="mt-0.5 block font-mono text-[11px] leading-snug tracking-wide sm:truncate"
                    style={{ color: m.color }}
                  >
                    {s.kinds[kind]}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const galleryLook: Record<string, { color: string; icon: ReactNode }> = {
  ai: cats["ai"]!,
  robotics: { color: "var(--blue)", icon: robot },
  vr: cats["xr"]!,
  events: {
    color: "var(--violet)",
    icon: <path d="M12 2l2.4 6.6L21 9l-5 4.6L17.5 21 12 17.3 6.5 21 8 13.6 3 9l6.6-.4z" />,
  },
  arduino: { color: "var(--cyan)", icon: cats["hardware"]!.icon },
  grad: {
    color: "var(--blue)",
    icon: (
      <>
        <path d="M2 9l10-5 10 5-10 5z" />
        <path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6" />
      </>
    ),
  },
};
const gallerySpans = [
  "md:col-span-2 md:row-span-2",
  "",
  "",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
];

export function Gallery() {
  const { t } = useLang();
  const g = t.about.gallery;
  return (
    <section id="gallery" className="relative px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36">
      <div className="mx-auto max-w-[96rem]">
        <SectionHead kicker={g.kicker} title={g.title} sub={g.sub} />
        <div className="grid auto-rows-[16rem] gap-4 md:grid-cols-4 md:gap-5">
          {g.items.map((it, i) => {
            const m = galleryLook[it.k]!;
            return (
              <figure
                key={it.t}
                className={`reveal group relative overflow-hidden rounded-3xl border ${gallerySpans[i]}`}
                style={{ transitionDelay: `${(i % 3) * 100}ms` }}
              >
                <div
                  className="absolute inset-0 grid-bg transition-transform duration-1000 group-hover:scale-110"
                  style={{
                    background: `radial-gradient(70% 80% at 70% 20%, color-mix(in oklab, ${m.color} 35%, transparent), transparent 70%), linear-gradient(160deg, var(--card), var(--background))`,
                  }}
                />
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className={`absolute -end-6 -top-6 opacity-10 transition-all duration-700 group-hover:rotate-6 group-hover:opacity-40 md:opacity-20 ${i === 0 ? "h-40 w-40 md:h-72 md:w-72" : "h-36 w-36 md:h-44 md:w-44"}`}
                  fill="none"
                  stroke={m.color}
                  strokeWidth="0.8"
                >
                  {m.icon}
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <span
                    className="glass inline-block rounded-full px-3 py-1 font-mono text-[11px] tracking-widest"
                    style={{ color: m.color }}
                  >
                    {it.cat}
                  </span>
                  <h3
                    className={`mt-3 font-display leading-tight ${i === 0 ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"}`}
                  >
                    {it.t}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed text-muted-foreground transition-all duration-500 ${i === 0 ? "max-w-md" : "md:max-h-0 md:overflow-hidden md:opacity-0 md:group-hover:max-h-24 md:group-hover:opacity-100"}`}
                  >
                    {it.d}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
