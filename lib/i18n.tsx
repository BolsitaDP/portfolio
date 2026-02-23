"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Language = "es" | "en";

interface Dictionary {
  [key: string]: string | Dictionary;
}

const translations = {
  es: {
    nav: {
      about: "Sobre mí",
      projects: "Proyectos",
      skills: "Skills",
      education: "Educación",
      experience: "Experiencia",
      contact: "Contacto",
      langButton: "EN",
    },
    home: {
      badge: "Home (básica)",
    },
    about: {
      title: "Sobre mí",
      subtitle: "Perfil profesional resumido desde tu CV.",
    },
    projects: {
      title: "Proyectos",
      featured: "Destacados",
      viewDetails: "Ver detalles",
      techStack: "Stack",
      keyPoints: "Puntos clave",
      liveDemo: "Demo",
      repository: "Repo",
    },
    skills: {
      title: "Tech Skills",
      subtitle: "Tecnologías y herramientas principales.",
      softTitle: "Soft Skills",
      softSubtitle: "Habilidades de trabajo en equipo y ejecución.",
    },
    education: {
      title: "Educación",
    },
    experience: {
      title: "Experiencia",
    },
    contact: {
      title: "Contacto",
      subtitle: "Links directos de contacto y portfolio.",
      email: "Email",
      copyEmail: "Copiar",
      copiedEmail: "Copiado",
      copySuccessToast: "Email copiado exitosamente",
      copyErrorToast: "No se pudo copiar el email",
      linkedin: "LinkedIn",
      legacyPortfolio: "Portfolio (anterior)",
    },
  },
  en: {
    nav: {
      about: "About",
      projects: "Projects",
      skills: "Skills",
      education: "Education",
      experience: "Experience",
      contact: "Contact",
      langButton: "ES",
    },
    home: {
      badge: "Home (basic)",
    },
    about: {
      title: "About Me",
      subtitle: "Professional summary based on my CV.",
    },
    projects: {
      title: "Projects",
      featured: "Featured",
      viewDetails: "View details",
      techStack: "Stack",
      keyPoints: "Key points",
      liveDemo: "Demo",
      repository: "Repo",
    },
    skills: {
      title: "Tech Skills",
      subtitle: "Main technologies and tools.",
      softTitle: "Soft Skills",
      softSubtitle: "Teamwork and execution-oriented skills.",
    },
    education: {
      title: "Education",
    },
    experience: {
      title: "Experience",
    },
    contact: {
      title: "Contact",
      subtitle: "Direct links for contact and portfolio.",
      email: "Email",
      copyEmail: "Copy",
      copiedEmail: "Copied",
      copySuccessToast: "Email copied successfully",
      copyErrorToast: "Could not copy email",
      linkedin: "LinkedIn",
      legacyPortfolio: "Legacy Portfolio",
    },
  },
} satisfies Record<Language, Dictionary>;

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "portfolio-language";

function resolvePath(dict: Dictionary, key: string): string | undefined {
  const result = key
    .split(".")
    .reduce<string | Dictionary | undefined>((acc, part) => {
      if (!acc || typeof acc === "string") return undefined;
      return acc[ part ];
    }, dict);

  return typeof result === "string" ? result : undefined;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [ language, setLanguage ] = useState<Language>("es");

  useEffect(() => {
    const nextLanguage = (() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "es" || saved === "en") return saved;

      return navigator.language.toLowerCase().startsWith("en") ? "en" : "es";
    })();

    if (nextLanguage === "es") return;

    const rafId = window.requestAnimationFrame(() => {
      setLanguage(nextLanguage);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [ language ]);

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === "es" ? "en" : "es"));
  }, []);

  const t = useCallback(
    (key: string) => resolvePath(translations[ language ], key) ?? key,
    [ language ],
  );

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [ language, toggleLanguage, t ],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
