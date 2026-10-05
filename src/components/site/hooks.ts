import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Lenis smooth scrolling for the whole page; disabled for reduced-motion users. */
export function useSmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ anchors: { offset: -70 }, lerp: 0.1 });
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

export function scrollToTop(immediate = false) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo({ top: 0, behavior: immediate ? "instant" : "smooth" });
}

/** Freeze page scrolling while an overlay is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/**
 * 0 → 1 as the element travels through the viewport: 0 when its top reaches
 * `start` (fraction of viewport height), 1 when its bottom reaches `end`.
 */
export function useScrollProgress<T extends HTMLElement>(start = 0.85, end = 0.6) {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      const total = r.height + vh * (start - end);
      const v = total > 0 ? (vh * start - r.top) / total : 0;
      setP(Math.min(1, Math.max(0, v)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [start, end]);
  return [ref, p] as const;
}

export function useCounter(target: number, run: boolean, ms = 1600) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

/** Adds "in" class to every .reveal / .mask-reveal / [data-reveal] when visible */
export function useGlobalReveal(dep: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .mask-reveal, .reveal-words, [data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}
