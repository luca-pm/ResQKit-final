import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function normalizeLanguage(code) {
  return String(code || "ro").toLowerCase().startsWith("en") ? "en" : "ro";
}

export function localeFromLanguage(language) {
  return normalizeLanguage(language) === "en" ? "en-US" : "ro-RO";
}

export function speechLanguageFromLanguage(language) {
  return normalizeLanguage(language) === "en" ? "en-US" : "ro-RO";
}

export default function useLocale() {
  const { t, i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
  const locale = localeFromLanguage(language);
  const speechLanguage = speechLanguageFromLanguage(language);

  const pick = useMemo(
    () => (ro, en) => (language === "en" ? en : ro),
    [language]
  );

  return { t, i18n, language, locale, speechLanguage, pick };
}
