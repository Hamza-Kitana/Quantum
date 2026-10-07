import type { ReactNode } from "react";
import { contact } from "@/lib/content";
import { modes } from "./Chrome";

export const wa = (msg: string) =>
  `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(msg)}`;

export const cats: Record<string, { color: string; icon: ReactNode }> = {
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
