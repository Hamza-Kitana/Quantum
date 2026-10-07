import { useEffect, useRef } from "react";
import logo from "@/assets/quantum-logo.webp";
import { useLang } from "@/lib/i18n";
import { useCounter, useInView } from "./hooks";
import { PageLink } from "./PageTransition";

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = 0,
      h = 0,
      raf = 0;
    const mouse = { x: -999, y: -999 };
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
    }));
    const resize = () => {
      w = c.width = c.offsetWidth * devicePixelRatio;
      h = c.height = c.offsetHeight * devicePixelRatio;
    };
    resize();
    addEventListener("resize", resize);
    const mv = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * devicePixelRatio;
      mouse.y = (e.clientY - r.top) * devicePixelRatio;
    };
    addEventListener("pointermove", mv);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]!;
        const ax = a.x * w,
          ay = a.y * h;
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]!;
          const bx = b.x * w,
            by = b.y * h;
          const d = Math.hypot(ax - bx, ay - by);
          if (d < 160 * devicePixelRatio) {
            ctx.strokeStyle = `rgba(90,200,255,${0.18 * (1 - d / (160 * devicePixelRatio))})`;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, ay);
            ctx.lineTo(bx, by);
            ctx.stroke(); // circuit-style elbows
          }
        }
        const md = Math.hypot(ax - mouse.x, ay - mouse.y);
        const near = md < 140 * devicePixelRatio;
        ctx.fillStyle = near ? "rgba(170,110,255,1)" : "rgba(90,200,255,.7)";
        ctx.beginPath();
        ctx.arc(ax, ay, (near ? 3 : 1.6) * devicePixelRatio, 0, 7);
        ctx.fill();
        if (near) {
          ctx.strokeStyle = "rgba(170,110,255,.35)";
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", mv);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

const codeLines = [
  "import { brain } from 'quantum/ai'",
  "board.pinMode(13, OUTPUT)",
  "model.train(data, { epochs: 40 })",
  "digitalWrite(LED, HIGH)",
  "const app = createApp()",
  "sensor.read() // 23.4°C",
  "await deploy('production')",
  "nn.layers.push(dense(128))",
];

function Stat({ n, s, l, run }: { n: number; s: string; l: string; run: boolean }) {
  const v = useCounter(n, run);
  return (
    <div>
      <div className="font-display text-2xl text-signal rtl:text-right md:text-3xl" dir="ltr">
        {v}
        {s}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{l}</div>
    </div>
  );
}

const pillarPos = ["-top-2 start-0", "top-1/4 -end-4", "-bottom-2 end-2", "bottom-1/4 -start-6"];
const pillarLinks = ["/software", "/ai", "/arduino", "/courses"];

export function Hero() {
  const { t } = useLang();
  const [ref, inView] = useInView<HTMLDivElement>(0.1);
  const orb = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const codes = useRef<HTMLDivElement>(null);
  const fg = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = (e: PointerEvent) => {
      if (!orb.current) return;
      const x = (e.clientX / innerWidth - 0.5) * 20,
        y = (e.clientY / innerHeight - 0.5) * 20;
      orb.current.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg)`;
    };
    let raf = 0;
    const s = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(scrollY, innerHeight);
        if (bg.current) bg.current.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
        if (codes.current) codes.current.style.transform = `translate3d(0, ${y * -0.15}px, 0)`;
        if (fg.current && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
          const k = y / innerHeight;
          fg.current.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${1 - k * 0.08})`;
          fg.current.style.opacity = String(Math.max(0, 1 - k * 1.3));
          fg.current.style.filter = k > 0.02 ? `blur(${k * 8}px)` : "none";
        }
      });
    };
    addEventListener("pointermove", f, { passive: true });
    addEventListener("scroll", s, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", f);
      removeEventListener("scroll", s);
    };
  }, []);
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden grid-bg pt-24"
    >
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <HeroCanvas />
      </div>
      <div
        ref={codes}
        className="pointer-events-none absolute inset-0 overflow-hidden font-mono text-xs text-cyan/25 will-change-transform"
        dir="ltr"
      >
        {codeLines.map((l, i) => (
          <div
            key={i}
            className="absolute animate-float whitespace-nowrap"
            style={{
              top: `${10 + i * 11}%`,
              left: `${(i * 37) % 80}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div ref={fg} className="relative w-full origin-top will-change-transform">
        <div
          ref={ref}
          className="relative mx-auto grid w-full max-w-[96rem] items-center gap-12 px-6 md:px-16 lg:grid-cols-[1.2fr_1fr]"
        >
          <div>
            <p
              className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs text-cyan transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot" /> {t.hero.tag}
            </p>
            <h1 className="font-display text-4xl leading-[1.1] md:text-6xl xl:text-7xl">
              <span
                className={`block transition-all delay-200 duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              >
                {t.hero.title1}
              </span>
              <span
                className={`block text-signal transition-all delay-500 duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              >
                {t.hero.title2}
              </span>
            </h1>
            <p
              className={`mt-7 max-w-xl text-lg text-muted-foreground transition-all delay-700 duration-1000 ${inView ? "opacity-100" : "opacity-0"}`}
            >
              {t.hero.sub}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <PageLink
                to="/contact"
                className="group relative overflow-hidden rounded-full bg-signal px-7 py-3.5 font-semibold text-primary-foreground glow-cyan transition-transform hover:scale-[1.03]"
              >
                {t.hero.cta}
              </PageLink>
              <PageLink
                to="/about"
                className="rounded-full border px-7 py-3.5 transition-colors hover:border-cyan hover:text-cyan"
              >
                {t.hero.cta2}
              </PageLink>
            </div>
            <div className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t pt-6">
              {t.hero.stats.map((s) => (
                <Stat key={s.l} {...s} run={inView} />
              ))}
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan/30 animate-spin-slow" />
            <div
              className="absolute inset-8 rounded-full border border-violet/30 animate-spin-slow"
              style={{ animationDirection: "reverse", animationDuration: "26s" }}
            />
            <div
              ref={orb}
              className="absolute inset-14 transition-transform duration-300 ease-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src={logo}
                alt="Quantum"
                className="logo-glow-lg h-full w-full object-contain"
                style={{ transform: "translateZ(40px)" }}
              />
            </div>
            {t.about.pillars.map((p, i) => (
              <span
                key={p}
                className={`absolute z-10 ${pillarPos[i]} transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
                style={{ transitionDelay: `${900 + i * 150}ms` }}
              >
                <PageLink to={pillarLinks[i]!}>
                  <span
                    className="glass flex animate-float items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wider text-foreground transition-colors hover:border-cyan hover:text-cyan md:text-xs"
                    style={{ animationDelay: `${i * 0.8}s` }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot" />
                    {p}
                  </span>
                </PageLink>
              </span>
            ))}
            {[0, 72, 144, 216, 288].map((a) => (
              <span
                key={a}
                className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-cyan glow-cyan animate-pulse-dot"
                style={{
                  transform: `rotate(${a}deg) translateY(-50%) translateX(calc(min(28rem,100%)/2)) `,
                  animationDelay: `${a / 100}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <a
        href="#explore"
        className="group absolute bottom-6 left-1/2 hidden md:flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground transition-colors hover:text-cyan"
      >
        SCROLL
        <span className="relative h-10 w-px overflow-hidden bg-border">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-signal" />
        </span>
      </a>
    </section>
  );
}
