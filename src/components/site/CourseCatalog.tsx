import { useState, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { contact, content } from "@/lib/content";
import { SectionHead, modes } from "./Chrome";

const wa = (msg: string) => `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(msg)}`;

const cats: Record<string, { color: string; icon: ReactNode }> = {
  ai: { color: "var(--violet)", icon: modes["ai"]!.icon },
  xr: {
    color: "var(--cyan)",
    icon: (
      <>
        <path d="M3 9.5A2.5 2.5 0 0 1 5.5 7h13A2.5 2.5 0 0 1 21 9.5v5a2.5 2.5 0 0 1-2.5 2.5h-3.2l-2-2.4h-2.6l-2 2.4H5.5A2.5 2.5 0 0 1 3 14.5z" />
        <circle cx="8" cy="12" r="1.6" />
        <circle cx="16" cy="12" r="1.6" />
      </>
    ),
  },
  engines: {
    color: "var(--violet)",
    icon: (
      <>
        <path d="M7 6h10a5 5 0 0 1 4.9 6l-.8 3.8a2.4 2.4 0 0 1-4.1 1.1L14.5 14h-5L7 16.9a2.4 2.4 0 0 1-4.1-1.1L2.1 12A5 5 0 0 1 7 6z" />
        <path d="M7 9.5v3M5.5 11h3" />
        <circle cx="16" cy="10" r=".9" />
        <circle cx="17.8" cy="12" r=".9" />
      </>
    ),
  },
  hardware: { color: "var(--blue)", icon: modes["arduino"]!.icon },
  programming: { color: "var(--cyan)", icon: modes["software"]!.icon },
  webdesign: {
    color: "var(--cyan)",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="M3 9h18M6.5 6.5h.01M9 6.5h.01M8 14l2 2-2 2M13 18h3" />
      </>
    ),
  },
  secdata: {
    color: "var(--blue)",
    icon: (
      <>
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
};
const levelOf: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };

function Icon({
  children,
  color,
  className = "h-6 w-6",
}: {
  children: ReactNode;
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function Level({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[1, 2, 3].map((b) => (
          <span
            key={b}
            className="w-[4px] rounded-full transition-colors duration-500"
            style={{
              height: 4 + b * 3,
              background: b <= n ? color : "var(--border)",
              boxShadow: b <= n ? `0 0 6px ${color}` : "none",
            }}
          />
        ))}
      </span>
      {label}
    </span>
  );
}

export function CourseCatalog() {
  const { t } = useLang();
  const c = t.courses;
  const [cat, setCat] = useState("all");
  const all = c.catalog.map((it, i) => ({ ...it, i }));
  const list = cat === "all" ? all : all.filter((it) => it.cat === cat);
  const tabs = [
    { k: "all", n: c.all, count: all.length },
    ...c.cats.map((x) => ({ ...x, count: all.filter((it) => it.cat === x.k).length })),
  ];
  const catName = (k: string) => c.cats.find((x) => x.k === k)?.n ?? k;
  return (
    <section
      id="catalog"
      className="relative overflow-hidden bg-surface px-5 py-20 sm:px-6 sm:py-28 md:px-16 md:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 40% at 85% 10%, color-mix(in oklab, var(--violet) 14%, transparent), transparent 70%), radial-gradient(40% 35% at 10% 90%, color-mix(in oklab, var(--cyan) 10%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[96rem]">
        <SectionHead kicker={c.kicker} title={c.catalogTitle} sub={c.catalogSub} />
        <div className="reveal -mx-5 overflow-x-auto px-5 no-scrollbar md:mx-0 md:px-0">
          <div
            className="glass inline-flex gap-1 rounded-full p-1.5"
            role="tablist"
            aria-label={c.catalogTitle}
          >
            {tabs.map((tb) => {
              const on = cat === tb.k;
              return (
                <button
                  key={tb.k}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setCat(tb.k)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-all duration-300 active:scale-95 ${on ? "bg-signal font-semibold text-primary-foreground glow-cyan" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
                >
                  {tb.n}
                  <span
                    className={`grid h-5 min-w-5 place-items-center rounded-full px-1 font-mono text-[10px] ${on ? "bg-background/25" : "bg-white/5"}`}
                  >
                    {tb.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div key={cat} className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {list.map((it, j) => {
            const m = cats[it.cat]!;
            const lvl = levelOf[content.en.courses.catalog[it.i]!.lvl] ?? 1;
            return (
              <a
                key={`${it.cat}-${it.name}`}
                href={wa(c.waMsg + it.name)}
                target="_blank"
                rel="noreferrer"
                className="group relative flex min-h-[19rem] flex-col overflow-hidden rounded-3xl border bg-card/60 p-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 transition-[transform,border-color,box-shadow] hover:-translate-y-1.5 md:p-7"
                style={{
                  animationDelay: `${j * 45}ms`,
                  ["--c" as string]: m.color,
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(90% 70% at 100% 0%, color-mix(in oklab, ${m.color} 20%, transparent), transparent 70%)`,
                    boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${m.color} 60%, transparent), 0 30px 60px -30px ${m.color}`,
                  }}
                />
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute -bottom-8 -end-8 h-40 w-40 opacity-[0.05] transition-all duration-700 group-hover:-rotate-12 group-hover:scale-110 group-hover:opacity-[0.14]"
                  fill="none"
                  stroke={m.color}
                  strokeWidth="1"
                >
                  {m.icon}
                </svg>
                <span
                  aria-hidden
                  className="outline-num pointer-events-none absolute right-6 top-5 font-display text-5xl leading-none rtl:left-6 rtl:right-auto"
                  dir="ltr"
                >
                  {String(it.i + 1).padStart(2, "0")}
                </span>

                <div className="relative flex items-center gap-3">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl border transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                    style={{
                      borderColor: `color-mix(in oklab, ${m.color} 45%, transparent)`,
                      background: `linear-gradient(145deg, color-mix(in oklab, ${m.color} 22%, transparent), transparent)`,
                    }}
                  >
                    <Icon color={m.color}>{m.icon}</Icon>
                  </span>
                  <span
                    className="font-mono text-[11px] tracking-widest"
                    style={{ color: m.color }}
                  >
                    {catName(it.cat)}
                  </span>
                </div>

                <h3 className="relative mt-7 font-display text-xl leading-snug md:text-2xl">
                  {it.name}
                </h3>
                <p className="relative mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {it.desc}
                </p>

                <div className="relative mt-6 flex items-center justify-between gap-3 border-t pt-5 font-mono text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon color="currentColor" className="h-4 w-4">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </Icon>
                      {it.w} {c.weeks}
                    </span>
                    <Level n={lvl} label={it.lvl} color={m.color} />
                  </div>
                  <span
                    aria-label={c.ask}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 group-hover:border-transparent group-hover:bg-signal group-hover:text-primary-foreground"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100 rtl:origin-right"
                  style={{ background: m.color, boxShadow: `0 0 12px ${m.color}` }}
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const { t } = useLang();
  const f = t.faq;
  const [topic, setTopic] = useState(f.topics[0]!.k);
  const [open, setOpen] = useState<number | null>(0);
  const items = f.items.filter((it) => it.topic === topic);
  return (
    <section
      id="faq"
      className="relative overflow-hidden px-5 py-20 grid-bg sm:px-6 sm:py-28 md:px-16 md:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 50% at 20% 40%, color-mix(in oklab, var(--blue) 12%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-[96rem] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead kicker={f.kicker} title={f.title} sub={f.sub} />
          <div
            className="no-scrollbar reveal -mx-5 -mt-4 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:grid lg:overflow-visible lg:px-0"
            role="tablist"
            aria-label={f.title}
          >
            {f.topics.map((tp, i) => {
              const on = topic === tp.k;
              const count = f.items.filter((it) => it.topic === tp.k).length;
              return (
                <button
                  key={tp.k}
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setTopic(tp.k);
                    setOpen(0);
                  }}
                  className={`group relative flex shrink-0 items-center gap-4 overflow-hidden whitespace-nowrap rounded-full border px-4 py-2.5 text-start text-sm transition-all duration-300 active:scale-[0.98] lg:rounded-2xl lg:px-5 lg:py-4 lg:text-base ${on ? "border-cyan/50 bg-cyan/10 text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:bg-white/[0.03] hover:text-foreground lg:bg-transparent"}`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-3 start-0 hidden w-[3px] rounded-full bg-signal transition-opacity duration-300 lg:block ${on ? "opacity-100" : "opacity-0"}`}
                  />
                  <span
                    className={`hidden font-mono text-xs lg:inline ${on ? "text-cyan" : "text-muted-foreground/60"}`}
                    dir="ltr"
                  >
                    0{i + 1}
                  </span>
                  <span className="flex-1">{tp.n}</span>
                  <span
                    className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 font-mono text-[11px] transition-colors ${on ? "bg-cyan text-primary-foreground" : "bg-white/5"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="reveal relative mt-8 hidden overflow-hidden rounded-3xl bg-signal p-[1px] lg:block">
            <div className="relative rounded-3xl bg-card/95 p-7">
              <span className="absolute -end-10 -top-10 h-32 w-32 rounded-full bg-violet/20 blur-2xl" />
              <p className="relative font-display text-xl">{f.more}</p>
              <p className="relative mt-2 text-sm text-muted-foreground">{f.moreSub}</p>
              <a
                href={wa(t.contact.waHello)}
                target="_blank"
                rel="noreferrer"
                className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-primary-foreground glow-cyan transition-transform hover:scale-[1.03]"
              >
                {f.moreBtn}
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
              </a>
            </div>
          </div>
        </div>

        <div key={topic} className="space-y-4">
          {items.map((it, i) => {
            const on = open === i;
            return (
              <div
                key={it.q}
                className={`relative overflow-hidden rounded-3xl border transition-all duration-500 animate-in fade-in slide-in-from-bottom-3 fill-mode-both ${on ? "border-cyan/40 bg-card/90 shadow-[0_30px_70px_-35px_var(--cyan)]" : "bg-card/40 hover:border-cyan/25 hover:bg-card/60"}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}
                  style={{
                    background:
                      "radial-gradient(70% 60% at 100% 0%, color-mix(in oklab, var(--cyan) 12%, transparent), transparent 70%)",
                  }}
                />
                <button
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  className="relative flex w-full items-center gap-5 p-6 text-start md:gap-6 md:p-8"
                >
                  <span
                    className={`hidden font-display text-2xl transition-colors duration-500 sm:block ${on ? "text-signal" : "text-foreground/20"}`}
                    dir="ltr"
                  >
                    0{i + 1}
                  </span>
                  <span className="flex-1 text-lg font-semibold leading-snug md:text-xl">
                    {it.q}
                  </span>
                  <span
                    className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${on ? "rotate-45 border-transparent bg-signal text-primary-foreground" : "text-cyan"}`}
                  >
                    <span className="absolute h-[2px] w-3.5 rounded-full bg-current" />
                    <span className="absolute h-3.5 w-[2px] rounded-full bg-current" />
                  </span>
                </button>
                <div
                  className={`relative grid transition-all duration-500 ease-out ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-7 leading-relaxed text-muted-foreground sm:ps-[4.75rem] md:px-8 md:pb-8 md:ps-[5.5rem]">
                      {it.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <a
            href={wa(t.contact.waHello)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-4 rounded-3xl bg-signal p-[1px] lg:hidden"
          >
            <span className="flex w-full items-center justify-between gap-4 rounded-3xl bg-card/95 p-6">
              <span>
                <span className="block font-display text-lg">{f.more}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{f.moreSub}</span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-signal text-primary-foreground">
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
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
