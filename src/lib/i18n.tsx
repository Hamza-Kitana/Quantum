import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { content, type Lang } from "./content";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (typeof content)["en"] };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("q-lang");
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    localStorage.setItem("q-lang", l);
    setLangState(l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: content[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const c = useContext(LangContext);
  if (!c) throw new Error("useLang must be inside LangProvider");
  return c;
}
