import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { LangProvider, useLang } from "@/lib/i18n";
import { CursorGlow, Footer, Loader, Nav, SignalLine } from "@/components/site/Chrome";
import { PageLink, PageTransitionProvider, pageOf } from "@/components/site/PageTransition";
import { useSmoothScroll } from "@/components/site/hooks";
import { MobileTabBar } from "@/components/site/MobileApp";

function NotFoundComponent() {
  const { t } = useLang();
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden grid-bg px-6 pt-24">
      <span
        aria-hidden
        className="outline-num pointer-events-none absolute select-none font-display text-[40vw] leading-none md:text-[28vw]"
        dir="ltr"
      >
        404
      </span>
      <div className="relative max-w-xl text-center">
        <svg viewBox="0 0 300 40" className="mx-auto h-10 w-72" fill="none" aria-hidden>
          <path
            d="M0 20 H110 L120 8 H135"
            stroke="var(--cyan)"
            strokeWidth="2"
            style={{ filter: "drop-shadow(0 0 6px var(--cyan))" }}
          />
          <path d="M165 32 H180 L190 20 H300" stroke="var(--border)" strokeWidth="1.5" />
          <circle cx="135" cy="8" r="3" fill="var(--cyan)" className="animate-pulse-dot" />
          <circle cx="165" cy="32" r="3" fill="var(--border)" />
        </svg>
        <p className="mt-6 font-mono text-xs tracking-[0.4em] text-cyan" dir="ltr">
          ERROR 404
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-6xl">{t.pages.lost.title}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{t.pages.lost.sub}</p>
        <PageLink
          to="/"
          className="mt-10 inline-block rounded-full bg-signal px-8 py-4 font-semibold text-primary-foreground glow-cyan transition-transform hover:scale-[1.04]"
        >
          {t.pages.lost.btn}
        </PageLink>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#080a18" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Quantum" },
      { name: "format-detection", content: "telephone=no" },
      { title: "Quantum" },
      { name: "description", content: "Quantum — Software, AI, Arduino & tech education." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon-32.png?v=2", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon.png?v=2", type: "image/png", sizes: "64x64" },
      { rel: "icon", href: "/icon-192.png?v=2", type: "image/png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600&family=Alexandria:wght@400;500;600;700&family=Readex+Pro:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Michroma&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("q-lang")==="ar"){document.documentElement.lang="ar";document.documentElement.dir="rtl"}}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <PageTransitionProvider>
          <SiteShell />
        </PageTransitionProvider>
      </LangProvider>
    </QueryClientProvider>
  );
}

function SiteShell() {
  useSmoothScroll();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="relative">
      <Loader />
      <CursorGlow />
      <Nav />
      <SignalLine key={path} base={pageOf(path).id} />
      <main className="relative z-10">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
