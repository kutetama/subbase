// 설정 다이얼로그 스토어 — 열림/활성 탭/딥링크. studio 동작 명세 참조 자체 구현.
// 기능: openSettings(탭?) 딥링크 · 마지막 탭 localStorage 기억 · 닫힐 때 열었던 요소로 포커스 복원.
import { create } from "zustand";

const TAB_KEY = "subbase.settings.tab";

interface SettingsUiState {
  open: boolean;
  activeTab: string;
  /** 다이얼로그를 연 시점의 포커스 요소 — 닫을 때 복원 */
  opener: HTMLElement | null;
  openSettings: (tab?: string) => void;
  closeSettings: () => void;
  setActiveTab: (tab: string) => void;
}

const readStoredTab = (): string => {
  try {
    return window.localStorage.getItem(TAB_KEY) ?? "general";
  } catch {
    return "general";
  }
};

// ?settings[=탭] 쿼리로 초기 오픈 (헤드리스 스크린샷 검증용 — ?dark와 동일 취지)
const initialQuery =
  typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

export const useSettingsUi = create<SettingsUiState>((set, get) => ({
  open: initialQuery?.has("settings") ?? false,
  activeTab:
    initialQuery?.get("settings") || (typeof window !== "undefined" ? readStoredTab() : "general"),
  opener: null,
  openSettings: (tab) =>
    set((s) => ({
      open: true,
      activeTab: tab ?? s.activeTab,
      opener:
        document.activeElement instanceof HTMLElement && document.activeElement !== document.body
          ? document.activeElement
          : null,
    })),
  closeSettings: () => {
    const { opener } = get();
    set({ open: false });
    // 다음 페인트에서 복원 — 다이얼로그 unmount 후 포커스가 body로 떨어지는 것 방지
    requestAnimationFrame(() => {
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
  },
  setActiveTab: (tab) => {
    try {
      window.localStorage.setItem(TAB_KEY, tab);
    } catch {
      /* 무시 */
    }
    set({ activeTab: tab });
  },
}));
