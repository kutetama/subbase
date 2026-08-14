// TOAST app-icons.tsx 이식 — 아이콘 레지스트리 (react-icons, Heroicons 중심).
// 원본: TOAST asset/app-icons.tsx. 변경: ① cn 경로 교체, ② switch → Record (동작·키 동일, 기본 폴백 유지),
// ⑤ 서비스 아이콘은 app/service-icons.ts에서 병합 (ds 파일 무수정 확장 — 동기화 안전),
// ③ appIcon/appIconOption 타입은 원본 @/types/common-components 부재로 switch 케이스에서 완전 복원,
// ④ ICON_AGENT(제품 고유 커스텀 SVG)는 제외 — 서비스에서 레지스트리 확장으로 추가.
import type { IconType } from "react-icons";
import type { ReactElement } from "react";
import {
  HiOutlineEmojiHappy,
  HiOutlineClipboard,
  HiOutlineDocumentAdd,
  HiOutlineShieldCheck,
  HiOutlinePlusSm,
  HiOutlineMinusSm,
  HiOutlineQuestionMarkCircle,
  HiOutlineRefresh,
  HiOutlineX,
  HiOutlineXCircle,
  HiOutlineExclamationCircle,
  HiOutlineChevronLeft,
  HiOutlineDotsVertical,
  HiOutlineSearch,
  HiOutlineSearchCircle,
  HiOutlineEyeOff,
  HiOutlineEye,
  HiOutlineArrowRight,
  HiOutlineMenuAlt4,
  HiOutlineTrash,
  HiOutlineArrowsExpand,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
  HiCheck,
  HiExclamationCircle,
  HiArrowsExpand,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineCalendar,
  HiOutlineDownload,
  HiOutlineChevronRight,
  HiOutlineMinus,
  HiOutlinePlus,
} from "react-icons/hi";
import {
  HiOutlineDocument,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineInboxStack,
  HiOutlineFolderPlus,
  HiOutlineBell,
  HiOutlineArrowUpOnSquare,
  HiOutlineCog6Tooth,
  HiOutlineUser,
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineChartPie,
  HiOutlineWrench,
  HiOutlineChatBubbleOvalLeftEllipsis,
  HiOutlineCursorArrowRays,
  HiOutlineTableCells,
  HiOutlinePhoto,
  HiArrowsUpDown,
  HiMiniPencilSquare,
  HiOutlineClipboardDocument,
  HiMagnifyingGlassPlus,
  HiMagnifyingGlassMinus,
  HiStop,
  HiXMark,
  HiUser,
  HiArrowDownTray,
} from "react-icons/hi2";
import { BsFillTriangleFill } from "react-icons/bs";
import { LuPanelRightClose, LuGitBranch } from "react-icons/lu";
import { RiBrainLine } from "react-icons/ri";
import { IoText } from "react-icons/io5";
import { RxDragHandleDots2 } from "react-icons/rx";
import { cn } from "@/ds/lib/cn";
import { SERVICE_ICONS } from "@/app/service-icons";

const BASE_ICONS = {
  OL_SHIELD_CHECK: HiOutlineShieldCheck,
  OL_CLIPBOARD: HiOutlineClipboard,
  OL_INBOX_STACK: HiOutlineInboxStack,
  OL_BUBBLE_LEFT: HiOutlineChatBubbleOvalLeft,
  OL_DOCUMENT_ADD: HiOutlineDocumentAdd,
  OL_DOCUMENT: HiOutlineDocument,
  OL_PLUS_SM: HiOutlinePlusSm,
  OL_MINUS_SM: HiOutlineMinusSm,
  OL_FOLDER_PLUS: HiOutlineFolderPlus,
  OL_QUESTION_MARK_CIRCLE: HiOutlineQuestionMarkCircle,
  OL_REFRESH: HiOutlineRefresh,
  OL_X: HiOutlineX,
  OL_X_CIRCLE: HiOutlineXCircle,
  OL_EXCLAMATION_CIRCLE: HiOutlineExclamationCircle,
  OL_CHEVRON_LEFT: HiOutlineChevronLeft,
  OL_CHEVRON_DOWN: HiOutlineChevronDown,
  OL_CHEVRON_UP: HiOutlineChevronUp,
  OL_DOTS_VERTICAL: HiOutlineDotsVertical,
  OL_SEARCH: HiOutlineSearch,
  OL_SEARCH_CIRCLE: HiOutlineSearchCircle,
  OL_EYE_OFF: HiOutlineEyeOff,
  OL_EYE: HiOutlineEye,
  OL_ARROW_RIGHT: HiOutlineArrowRight,
  OL_MENU_ALT_4: HiOutlineMenuAlt4,
  OL_BELL: HiOutlineBell,
  OL_TRASH: HiOutlineTrash,
  OL_ARROW_UP_SQUARE: HiOutlineArrowUpOnSquare,
  OL_ARROW_EXPAND: HiOutlineArrowsExpand,
  OL_CHEVRON_DOUBLE_LEFT: HiOutlineChevronDoubleLeft,
  OL_CHEVRON_DOUBLE_RIGHT: HiOutlineChevronDoubleRight,
  OL_COG_6_TOOTH: HiOutlineCog6Tooth,
  OL_HAPPY: HiOutlineEmojiHappy,
  OL_CALENDAR: HiOutlineCalendar,
  OL_USER: HiOutlineUser,
  OL_PAPER_AIRPLANE: HiOutlinePaperAirplane,
  OL_SPARKLES: HiOutlineSparkles,
  OL_CHART_PIE: HiOutlineChartPie,
  OL_WRENCH: HiOutlineWrench,
  OL_DOWNLOAD: HiOutlineDownload,
  OL_CHAT_BUBBLE_LEFT: HiOutlineChatBubbleOvalLeftEllipsis,
  OL_CURSOR_ARROW_RAYS: HiOutlineCursorArrowRays,
  OL_TABLE_CELLS: HiOutlineTableCells,
  OL_PHOTO: HiOutlinePhoto,
  OL_CHEVRON_RIGHT: HiOutlineChevronRight,
  OL_MINUS: HiOutlineMinus,
  OL_PLUS: HiOutlinePlus,
  CHEVRON_DOUBLE_LEFT: HiChevronDoubleLeft,
  CHEVRON_DOUBLE_RIGHT: HiChevronDoubleRight,
  CHEVRON_LEFT: HiChevronLeft,
  CHEVRON_RIGHT: HiChevronRight,
  CHEVRON_DOWN: HiChevronDown,
  CHECK: HiCheck,
  EXCLAMATION_CIRCLE: HiExclamationCircle,
  ARROW_UP_DOWN: HiArrowsUpDown,
  ARROW_EXPAND: HiArrowsExpand,
  MINI_PENCIL_SQUARE: HiMiniPencilSquare,
  CLIPBOARD_DOCUMENT: HiOutlineClipboardDocument,
  TRIANGLE_FILL: BsFillTriangleFill,
  GLASS_PLUS: HiMagnifyingGlassPlus,
  GLASS_MINUS: HiMagnifyingGlassMinus,
  PANEL_RIGHT_CLOSE: LuPanelRightClose,
  GIT_BRANCH: LuGitBranch,
  BRAIN_LINE: RiBrainLine,
  STOP: HiStop,
  X_MARK: HiXMark,
  USER: HiUser,
  IO_TEXT: IoText,
  ARROW_DOWN_TRAY: HiArrowDownTray,
  DRAG_HANDLE_DOTS: RxDragHandleDots2,
} satisfies Record<string, IconType>;

// 서비스 확장 병합 지점 — 이 파일(ds 소유)은 수정하지 말고 app/service-icons.ts에 등록한다 (DS 동기화 안전).
const ICONS = { ...BASE_ICONS, ...SERVICE_ICONS };

export type appIcon = keyof typeof ICONS;

/** 등록된 전체 아이콘 키 — 디자인 카탈로그(아이콘 페이지) 등에서 사용 */
export const APP_ICON_NAMES = Object.keys(ICONS) as appIcon[];

export interface AppIconOption {
  size?: number;
  colorClass?: string;
}

/** @deprecated `AppIconOption`을 사용하세요. */
export type appIconOption = AppIconOption; // NOSONAR -- 기존 서비스의 공개 타입 호환성 유지

const APP_ICON_CLASSES = "pointer-events-none";

export const getAppIcon = (name: appIcon, option?: AppIconOption): ReactElement => {
  const size = option?.size ?? 24;
  const classes = cn(APP_ICON_CLASSES, option?.colorClass);
  const Icon = ICONS[name] ?? HiOutlineEmojiHappy;
  return <Icon size={size} className={classes} />;
};
