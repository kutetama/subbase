// 앱 셸 UI 상태 — 사이드바 접힘 등 브라우저 로컬 환경설정.
import { create } from "zustand";

const COMPACT_KEY = "subbase.sidebarCompact";

const readBool = (key: string): boolean => {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

interface UiState {
  sidebarCompact: boolean;
  setSidebarCompact: (compact: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCompact: typeof window !== "undefined" ? readBool(COMPACT_KEY) : false,
  setSidebarCompact: (compact) => {
    try {
      window.localStorage.setItem(COMPACT_KEY, compact ? "1" : "0");
    } catch {
      /* 무시 */
    }
    set({ sidebarCompact: compact });
  },
}));

/** 환경설정 재설정 — subbase.* 로컬 키 전부 제거 (설정 일반 탭의 destructive 액션) */
export const resetLocalPreferences = () => {
  try {
    const keys = Object.keys(window.localStorage).filter((k) => k.startsWith("subbase."));
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* 무시 */
  }
  window.location.reload();
};
