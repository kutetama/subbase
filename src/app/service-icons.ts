// 서비스 고유 아이콘 등록 지점 (서비스 소유 파일 — DS 동기화 대상 아님).
// ds/icons.tsx의 BASE_ICONS와 병합된다. 예:
//   import { HiOutlineBeaker } from "react-icons/hi2";
//   export const SERVICE_ICONS = { BEAKER: HiOutlineBeaker } satisfies Record<string, IconType>;
import type { IconType } from "react-icons";

export const SERVICE_ICONS = {} satisfies Record<string, IconType>;
