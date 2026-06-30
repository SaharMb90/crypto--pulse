"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Locale, dictionary, Dictionary } from "./i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fa");

  useEffect(() => {
    const stored = window.localStorage.getItem("cp_locale") as Locale | null;
    if (stored === "en" || stored === "fa") setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dictionary[locale].dir;
  }, [locale]);

  function setLocale(l: Locale) {
    setLocaleState(l);
    window.localStorage.setItem("cp_locale", l);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dictionary[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
