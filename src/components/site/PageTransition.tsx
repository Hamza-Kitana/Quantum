import {
  type CSSProperties,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/quantum-mark.webp";
import { useLang } from "@/lib/i18n";
import { scrollToTop, useScrollLock } from "./hooks";

export const pages = [
  { id: "home", to: "/", color: "var(--cyan)" },
  { id: "about", to: "/about", color: "var(--cyan)" },
  { id: "software", to: "/software", color: "var(--cyan)" },
  { id: "ai", to: "/ai", color: "var(--violet)" },
  { id: "arduino", to: "/arduino", color: "var(--blue)" },
  { id: "courses", to: "/courses", color: "var(--cyan)" },
  { id: "projects", to: "/projects", color: "var(--violet)" },
  { id: "contact", to: "/contact", color: "var(--cyan)" },
] as const;
export type Page = (typeof pages)[number];
export type PageId = Page["id"];
export type SubPage = Exclude<Page, { id: "home" }>;
export const navPages = pages.filter((p): p is SubPage => p.id !== "home");
export const pageOf = (path: string): Page => {
  const clean = path.replace(/\/+$/, "") || "/";
  return pages.find((p) => p.to === clean) ?? pages[0];
};
export const pageIndex = (id: PageId) => pages.findIndex((p) => p.id === id);

type Phase = "idle" | "cover" | "hold" | "reveal";
type Ctx = { go: (to: string) => void; phase: Phase };
const TransitionContext = createContext<Ctx>({ go: () => {}, phase: "idle" });

/** True once the incoming page is visible, so heroes can start their entrance. */
export const usePageReady = () => {
  const { phase } = useContext(TransitionContext);
  return phase === "idle" || phase === "reveal";
};

const COVER_MS = 820,
  HOLD_MS = 380,
  REVEAL_MS = 950;

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<Page>(pages[0]);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  useScrollLock(phase !== "idle");
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const lift = useCallback(() => {
    setPhase("reveal");
    later(() => {
      setPhase("idle");
      busy.current = false;
    }, REVEAL_MS);
  }, []);

  const go = useCallback(
    (to: string) => {
      if (busy.current) return;
      if (to === path) {
        scrollToTop();
        return;
      }
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        void navigate({ to }).then(() => scrollToTop(true));
        return;
      }
      busy.current = true;
      setTarget(pageOf(to));
      setPhase("cover");
      later(async () => {
        await navigate({ to });
        scrollToTop(true);
        setPhase("hold");
        later(lift, HOLD_MS);
      }, COVER_MS);
    },
    [path, navigate, lift],
  );

  // Back/forward: the route already changed, so cover briefly and lift onto the new page.
  useEffect(() => {
    const onPop = () => {
      if (busy.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      busy.current = true;
      setTarget(pageOf(location.pathname));
      setPhase("cover");
      later(() => {
        scrollToTop(true);
        setPhase("hold");
        later(lift, HOLD_MS);
      }, COVER_MS);
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [lift]);

  return (
    <TransitionContext.Provider value={{ go, phase }}>
      {children}
      <Overlay phase={phase} target={target} />
    </TransitionContext.Provider>
  );
}

function Overlay({ phase, target }: { phase: Phase; target: Page }) {
  const { t } = useLang();
  const n = pageIndex(target.id);
  const name = target.id === "home" ? t.pages.home : t.nav[target.id];
  return (
    <div
      aria-hidden
      className={`pt-overlay pt-${phase}`}
      style={{ ["--c" as string]: target.color }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="pt-panel" style={{ ["--i" as string]: i }} />
      ))}
      <div className="pt-center">
        <div className="flex flex-col items-center px-6 text-center">
          <div className="relative h-20 w-20">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 animate-spin-slow"
              style={{ animationDuration: "2.2s" }}
            >
              <circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke={target.color}
                strokeWidth="1.5"
                strokeDasharray="70 230"
                strokeLinecap="round"
              />
            </svg>
            <img src={logo} alt="" className="logo-glow absolute inset-2 object-contain" />
          </div>
          <div
            className="mt-8 overflow-hidden font-display text-6xl leading-none md:text-8xl"
            dir="ltr"
          >
            <span
              className="pt-num"
              style={{ color: target.color, textShadow: `0 0 14px ${target.color}` }}
            >
              0{n}
            </span>
          </div>
          <div className="mt-3 overflow-hidden">
            <span
              className="pt-num font-display text-2xl text-foreground md:text-4xl"
              style={{ transitionDelay: ".5s" }}
            >
              {name}
            </span>
          </div>
          <svg viewBox="0 0 300 20" className="mt-8 h-5 w-64 md:w-80" fill="none">
            <path
              d="M0 10 H90 L100 3 H130 L140 17 H170 L180 10 H300"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <path
              className="pt-trace"
              pathLength={1}
              d="M0 10 H90 L100 3 H130 L140 17 H170 L180 10 H300"
              stroke={target.color}
              strokeWidth="2"
              style={{ filter: `drop-shadow(0 0 5px ${target.color})` }}
            />
          </svg>
          <p className="mt-4 font-mono text-[10px] tracking-[0.45em] text-muted-foreground">
            {t.pages.loading}…
          </p>
        </div>
      </div>
    </div>
  );
}

type LinkProps = {
  to: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  "aria-current"?: "page" | undefined;
  style?: CSSProperties;
};

/** Internal link that plays the page transition before navigating. */
export function PageLink({ to, className, children, onClick, ...rest }: LinkProps) {
  const { go } = useContext(TransitionContext);
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(to);
  };
  return (
    <Link to={to as "/"} className={className} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
