// i18n 기반 — ko/en 로케일, 번역 훅, 언어 영속. 공통 컴포넌트 문자열은 이 키를 거친다 (BRIEF IN).
import { create } from "zustand";
import { ko } from "./locales/ko";
import { en } from "./locales/en";

export type TranslationKey = keyof typeof ko;
export type Locale = "ko" | "en";

const STORAGE_KEY = "toastfy.locale";
const DICTS: Record<Locale, Record<TranslationKey, string>> = { ko, en };

const readStored = (): Locale => {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "ko" || v === "en") return v;
  } catch {
    /* 무시 */
  }
  return "ko";
};

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  locale: typeof window !== "undefined" ? readStored() : "ko",
  setLocale: (locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* 무시 */
    }
    set({ locale });
  },
}));

/** 번역 훅 — `const t = useT(); t("settings.title")` */
export const useT = () => {
  const locale = useI18nStore((s) => s.locale);
  return (key: TranslationKey): string => DICTS[locale][key] ?? key;
};
