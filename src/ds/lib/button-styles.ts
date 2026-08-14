// 버튼 사이즈 스타일 — 원본 @/constants/common-components·@/types/common-components(발췌본 누락)의 재구성.
// 근거 (추정 아님, 실측):
//   - 피그마 "Toaster 디자인 가이드" 버튼 인스턴스 실측(2026-08-11): default 110×42(pad 12px),
//     small 90×36(pad 12px), fit 콘텐츠 폭×32(pad 10px) — 전부 typo 14/700(bold_smallP)·라운드 10px.
//   - 제품 tailwind.config.js 치수 토큰: min-w-button=110px, min-w-button_small=90px, min-h-default_button=42px.
//   - 사이즈 키 실사용 전수조사: default(폴백)·fit(18회)·small(7회)·full(1회).
// **피그마 실측값을 정본으로 확정** (2026-08-11 유저 결정 — 원본 대조 불요).
export type buttonSize = "default" | "small" | "fit" | "full";

export const sizeStyles: Record<buttonSize, string> = {
  default: "min-w-[110px] min-h-[42px]", // min-w-button, min-h-default_button
  small: "min-w-[90px] min-h-[36px]", // min-w-button_small
  fit: "min-h-[32px] px-2.5",
  full: "w-full min-h-[42px]",
};
