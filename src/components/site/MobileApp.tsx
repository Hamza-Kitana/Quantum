import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import { useRouterState } from "@tanstack/react-router";
import logo from "@/assets/quantum-mark.webp";
import { useLang } from "@/lib/i18n";
import { contact } from "@/lib/content";
import { modes } from "./Chrome";
import { useScrollLock } from "./hooks";
import { PageLink, pageOf, pages, type PageId } from "./PageTransition";

const homeIcon = <path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5h4v5" />;
const moreIcon = (
  <>
    <rect x="4" y="4" width="6" height="6" rx="1.5" />
    <rect x="14" y="4" width="6" height="6" rx="1.5" />
    <rect x="4" y="14" width="6" height="6" rx="1.5" />
    <rect x="14" y="14" width="6" height="6" rx="1.5" />
  </>
);
const tabs = ["home", "software", "ai", "arduino"] as const;

function Icon({
  children,
  className = "h-6 w-6",
  color = "currentColor",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** App-style bottom navigation for phones and tablets; the fifth tab opens the "More" sheet. */
export function MobileTabBar() {
  const { t } = useLang();
  const current = pageOf(useRouterState({ select: (s) => s.location.pathname })).id;
  const [open, setOpen] = useState(false);
  const tabIndex = (tabs as readonly PageId[]).indexOf(current);
  const active = !open && tabIndex >= 0 ? tabIndex : 4;
  const label = (id: (typeof tabs)[number]) => t.pages.app.tabs[id];
  return (
    <>
      <nav
        aria-label={t.pages.app.menu}
        className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 lg:hidden"
      >
        <div className="glass relative grid grid-cols-5 rounded-[1.6rem] border p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,.8)]">
          <span
            aria-hidden
            className="absolute inset-y-1.5 w-[calc((100%-0.75rem)/5)] rounded-[1.2rem] bg-cyan/10 ring-1 ring-cyan/30 transition-[inset-inline-start] duration-500 ease-[cubic-bezier(.2,.9,.2,1.15)]"
            style={{ insetInlineStart: `calc(0.375rem + ${active} * (100% - 0.75rem) / 5)` }}
          />
          {tabs.map((id, i) => {
            const on = active === i;
            const m = modes[id]!;
            return (
              <PageLink
                key={id}
                to={pages.find((p) => p.id === id)!.to}
                aria-current={on ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 rounded-[1.2rem] py-2 transition-transform active:scale-90 ${on ? "text-cyan" : "text-muted-foreground"}`}
              >
                <Icon
                  className={`h-[22px] w-[22px] transition-transform duration-300 ${on ? "-translate-y-0.5" : ""}`}
                  color={on ? (id === "home" ? "var(--cyan)" : m.color) : "currentColor"}
                >
                  {id === "home" ? homeIcon : m.icon}
                </Icon>
                <span className="max-w-full truncate px-1 text-[10px] font-medium leading-[1.5]">
                  {label(id)}
                </span>
              </PageLink>
            );
          })}
          <button
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-haspopup="dialog"
            className={`relative flex flex-col items-center gap-1 rounded-[1.2rem] py-2 transition-transform active:scale-90 ${active === 4 ? "text-cyan" : "text-muted-foreground"}`}
          >
            <Icon className="h-[22px] w-[22px]">{moreIcon}</Icon>
            <span className="text-[10px] font-medium leading-[1.5]">{t.pages.app.more}</span>
          </button>
        </div>
      </nav>
      <MoreSheet open={open} onClose={() => setOpen(false)} current={current} />
    </>
  );
}

function MoreSheet({
  open,
  onClose,
  current,
}: {
  open: boolean;
  onClose: () => void;
  current: PageId;
}) {
  const { t, lang, setLang } = useLang();
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);
  useScrollLock(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      addEventListener("keydown", k);
      return () => {
        cancelAnimationFrame(r);
        removeEventListener("keydown", k);
      };
    }
    setShown(false);
    const tm = setTimeout(() => setMounted(false), 450);
    return () => clearTimeout(tm);
  }, [open, onClose]);

  const onStart = (e: TouchEvent) => {
    drag.current = { y: e.touches[0]!.clientY, dy: 0 };
  };
  const onMove = (e: TouchEvent) => {
    if (!drag.current || !panel.current) return;
    drag.current.dy = Math.max(0, e.touches[0]!.clientY - drag.current.y);
    panel.current.style.transition = "none";
    panel.current.style.transform = `translateY(${drag.current.dy}px)`;
  };
  const onEnd = () => {
    if (!panel.current || !drag.current) return;
    panel.current.style.transition = "";
    panel.current.style.transform = "";
    if (drag.current.dy > 90) onClose();
    drag.current = null;
  };

  if (!mounted) return null;
  const wa = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(t.contact.waHello)}`;
  const quick = [
    {
      href: wa,
      label: t.contact.labels.whatsapp,
      ext: true,
      icon: (
        <path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.7L4 20zM9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-2.1-2.1l.8-1-1-2L9 9.5z" />
      ),
    },
    {
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
      label: t.pages.app.call,
      ext: false,
      icon: (
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
      ),
    },
    {
      href: contact.instagram,
      label: t.contact.labels.instagram,
      ext: true,
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
        </>
      ),
    },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[70] lg:hidden" data-lenis-prevent>
      <div
        className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-400 ${shown ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={t.pages.app.menu}
        className={`absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto rounded-t-[2rem] border-t bg-card pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_-10px_rgba(0,0,0,.8)] transition-transform duration-[450ms] ease-[cubic-bezier(.2,.9,.2,1)] ${shown ? "translate-y-0" : "translate-y-full"}`}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
      >
        <div className="sticky top-0 z-10 bg-card/95 px-5 pb-3 pt-3 backdrop-blur">
          <span aria-hidden className="mx-auto block h-1.5 w-11 rounded-full bg-white/20" />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" className="logo-glow h-10 w-10 object-contain" />
              <span
                className="font-display text-sm tracking-[0.3em] text-signal"
                style={{ fontFamily: "Michroma" }}
                dir="ltr"
              >
                QUANTUM
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label={t.pages.app.close}
              className="grid h-9 w-9 place-items-center rounded-full border text-muted-foreground transition-transform active:scale-90"
            >
              <Icon className="h-4 w-4">
                <path d="M6 6l12 12M18 6 6 18" />
              </Icon>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-x-2 gap-y-5 px-5 pt-3">
          {pages.map((p, i) => {
            const m = modes[p.id]!;
            const on = current === p.id;
            return (
              <PageLink
                key={p.id}
                to={p.to}
                onClick={onClose}
                className={`flex flex-col items-center gap-2 transition-all duration-500 active:scale-90 ${shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                style={{ transitionDelay: shown ? `${80 + i * 35}ms` : "0ms" }}
                aria-current={on ? "page" : undefined}
              >
                <span
                  className="relative grid h-14 w-14 place-items-center rounded-2xl border"
                  style={{
                    background: `linear-gradient(145deg, color-mix(in oklab, ${m.color} 22%, transparent), color-mix(in oklab, ${m.color} 6%, transparent))`,
                    borderColor: on ? m.color : `color-mix(in oklab, ${m.color} 30%, transparent)`,
                    boxShadow: on ? `0 0 18px -4px ${m.color}` : undefined,
                  }}
                >
                  <Icon color={p.id === "home" ? "var(--cyan)" : m.color}>
                    {p.id === "home" ? homeIcon : m.icon}
                  </Icon>
                  {on && (
                    <span
                      className="absolute -top-1 end-0 h-2.5 w-2.5 rounded-full border-2 border-card"
                      style={{ background: m.color }}
                    />
                  )}
                </span>
                <span
                  className={`text-center text-[11px] leading-tight ${on ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {p.id === "home" ? t.pages.home : t.nav[p.id]}
                </span>
              </PageLink>
            );
          })}
        </div>

        <div className="mx-5 mt-7 flex items-center justify-between rounded-2xl border bg-background/50 p-2 ps-4">
          <span className="text-sm text-muted-foreground">{t.pages.app.language}</span>
          <div className="flex rounded-full border p-0.5 font-mono text-xs" dir="ltr">
            {(["ar", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-5 py-2 transition-colors ${lang === l ? "bg-signal text-primary-foreground" : "text-muted-foreground"}`}
              >
                {l === "ar" ? "العربية" : "English"}
              </button>
            ))}
          </div>
        </div>

        <p className="mx-5 mt-6 text-xs text-muted-foreground">{t.pages.app.quick}</p>
        <div className="mx-5 mt-3 grid grid-cols-3 gap-2">
          {quick.map((q) => (
            <a
              key={q.label}
              href={q.href}
              {...(q.ext ? { target: "_blank", rel: "noreferrer" } : {})}
              className="flex flex-col items-center gap-2 rounded-2xl border bg-background/50 py-4 text-xs transition-transform active:scale-95"
            >
              <Icon className="h-5 w-5" color="var(--cyan)">
                {q.icon}
              </Icon>
              {q.label}
            </a>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
