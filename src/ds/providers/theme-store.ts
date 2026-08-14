// 테마 스토어 — 라이트/다크/시스템 3모드 단일 소스.
// studio의 동작 명세(모드 영속·시스템 추적·탭 간 동기화)를 참조한 자체 구현(코드 복사 없음 — BRIEF 라이선스 제약).
// 책임: ① localStorage 영속 ② documentElement `.dark` 클래스 ③ seed 벤더링용 data-seed-color-mode 속성
//       ④ 시스템 테마(mq) 추적 ⑤ 브라우저 탭 간 storage 동기화 ⑥ ?dark 쿼리 초기화(스크린샷 검증용)
import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "toastfy.theme";
const mq = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null;

const readStored = (): ThemeMode => {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* storage 접근 불가 환경 무시 */
  }
  return "system";
};

const resolve = (mode: ThemeMode): ResolvedTheme => {
  if (mode !== "system") return mode;
  return mq?.matches ? "dark" : "light";
};

const applyToDocument = (resolved: ResolvedTheme) => {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.dataset.seedColorMode = resolved === "dark" ? "dark-only" : "light-only";
};

interface ThemeState {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const initialMode: ThemeMode =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("dark")
    ? "dark"
    : readStored();

export const useThemeStore = create<ThemeState>((set) => ({
  mode: initialMode,
  resolved: resolve(initialMode),
  setMode: (mode) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* 무시 */
    }
    const resolved = resolve(mode);
    applyToDocument(resolved);
    set({ mode, resolved });
  },
}));

// 모듈 로드 시 1회 적용 + 외부 변화 구독 (시스템 테마·다른 탭)
if (typeof window !== "undefined") {
  applyToDocument(resolve(initialMode));

  mq?.addEventListener("change", () => {
    const { mode } = useThemeStore.getState();
    if (mode !== "system") return;
    const resolved = resolve("system");
    applyToDocument(resolved);
    useThemeStore.setState({ resolved });
  });

  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY && e.key !== null) return;
    const mode = readStored();
    const resolved = resolve(mode);
    applyToDocument(resolved);
    useThemeStore.setState({ mode, resolved });
  });
}
