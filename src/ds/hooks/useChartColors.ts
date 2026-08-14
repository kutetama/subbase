// 차트 색 토큰 훅 — 엔진 중립(echarts·recharts 등 무관), 다크모드·런타임 브랜드 전환 자동 추종.
// JS로 그리는 차트는 CSS 변수를 직접 참조할 수 없어 색이 하드코딩되기 쉽다 — 이 훅이 그 갭을 메운다:
// 토큰 CSS 변수를 런타임에 읽고, 테마(resolved)와 documentElement의 data-brand 변경에 반응해 재계산한다.
import { useEffect, useState } from "react";
import { useThemeStore } from "@/ds/providers/theme-store";

export interface ChartColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  fg: string;
  fgMuted: string;
  fgSubtle: string;
  line: string;
  surface: string;
  success: string;
  danger: string;
  caution: string;
  /** 카테고리·시리즈용 8색 (팔레트 third-1..8) */
  series: string[];
}

const readVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const read = (): ChartColors => ({
  primary: readVar("--tk-color-palette-primary"),
  primaryDark: readVar("--tk-color-palette-primary-dark"),
  primaryLight: readVar("--tk-color-palette-primary-light"),
  fg: readVar("--tk-color-semantic-fg"),
  fgMuted: readVar("--tk-color-semantic-fg-muted"),
  fgSubtle: readVar("--tk-color-semantic-fg-subtle"),
  line: readVar("--tk-color-semantic-line"),
  surface: readVar("--tk-color-semantic-surface"),
  success: readVar("--tk-color-palette-success"),
  danger: readVar("--tk-color-palette-error"),
  caution: readVar("--tk-color-palette-caution"),
  series: Array.from({ length: 8 }, (_, i) => readVar(`--tk-color-palette-third-${i + 1}`)),
});

/** `#RRGGBB` → `rgba(...)` — 차트 영역 채움 등 알파 적용용 */
export const withAlpha = (hex: string, alpha: number): string => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = Number.parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export function useChartColors(): ChartColors {
  const resolved = useThemeStore((s) => s.resolved);
  const [colors, setColors] = useState<ChartColors>(read);

  // 테마 전환 — 스토어가 DOM 클래스를 적용한 뒤 렌더되므로 여기서 재계산하면 최신 값
  useEffect(() => {
    setColors(read());
  }, [resolved]);

  // 런타임 브랜드 전환 (documentElement.dataset.brand — --all-brands 빌드)
  useEffect(() => {
    const observer = new MutationObserver(() => setColors(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-brand"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}
