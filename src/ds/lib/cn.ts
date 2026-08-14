// TOAST app-cn.ts 계약 이식 — typo-* 유틸을 font-size 충돌 그룹에 등록해 병합 우선순위 보장 (제품 규칙).
// 원본 twMergeCustom은 발췌본에 없어 동일 의도로 재구현 (PoC 검증 완료).
import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const TYPO_STYLES = [
  "regular_overline",
  "regular_caption",
  "regular_smaller",
  "regular_smalllP",
  "medium_smaller",
  "semiBold_smaller",
  "semiBold_smalllP",
  "bold_caption",
  "bold_smaller",
  "bold_smallP",
  "bold_SemiSmallP",
  "bold_P",
  "bold_bigP",
  "bold_bigger",
  "bold_biggest",
  // 디스플레이 계열 신설 (피그마 실사용 유래)
  "bold_overline",
  "semiBold_h3",
  "bold_h2",
  "bold_display",
];

export const twMergeCustom = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ typo: TYPO_STYLES }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMergeCustom(clsx(inputs));
