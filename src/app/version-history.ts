export interface VersionEntry {
  version: string;
  date: string;
  notes: string[];
}

export const VERSION_HISTORY: VersionEntry[] = [
  {
    version: "0.2.0",
    date: "2026-08-14",
    notes: [
      "Toastfy v1.7.3 기반 구조와 동기화 체계 적용",
      "subBase 디자인 문서 콘텐츠를 최신 컴포넌트 API에 통합",
      "소개·적용 예시·업데이트 메뉴와 테마 전환 추가",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-08-12",
    notes: [
      "Figma subBase Components 전체 구현",
      "subBase 토큰·컴포넌트 문서·개발 서버 구성",
      "기존 템플릿 동기화 체계와 전용 프리셋 제거",
    ],
  },
];
