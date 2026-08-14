// 설정 탭 레지스트리 — 공통 4탭 + 옵션 모듈. 서비스는 이 파일에서 탭을 켜고 끄고 추가한다 (빌드타임 구성).
// 규칙: 활성화 여부는 여기의 enabled 플래그로만 — 런타임 환경값 감지로 탭을 숨기지 않는다.
import type { ComponentType } from "react";
import type { TranslationKey } from "@/i18n";
import type { appIcon } from "@/ds/icons";

import { GeneralTab, AppearanceTab, SystemTab, AboutTab } from "./tabs";
import { ProfileTab, ApiKeysTab, ConnectionsTab } from "./modules";

export interface SettingsTabDef {
  id: string;
  labelKey: TranslationKey;
  icon: appIcon;
  component: ComponentType;
  /** 관리자 전용 — 인증 도입 서비스에서 사용 (템플릿 기본은 단일 유저라 필터 미적용) */
  adminOnly?: boolean;
  enabled: boolean;
}

export const SETTINGS_TABS: SettingsTabDef[] = [
  // ── 공통 4탭 (3앱 교차 검증 공통분모 — BRIEF 부록 A) ──
  { id: "general", labelKey: "settings.tabs.general", icon: "OL_COG_6_TOOTH", component: GeneralTab, enabled: true },
  { id: "appearance", labelKey: "settings.tabs.appearance", icon: "OL_SPARKLES", component: AppearanceTab, enabled: true },
  { id: "system", labelKey: "settings.tabs.system", icon: "OL_TABLE_CELLS", component: SystemTab, enabled: true },
  { id: "about", labelKey: "settings.tabs.about", icon: "OL_QUESTION_MARK_CIRCLE", component: AboutTab, enabled: true },
  // ── 옵션 모듈 (기본 off — 필요 서비스에서 enabled: true 한 줄로 켬) ──
  { id: "profile", labelKey: "settings.tabs.profile", icon: "OL_USER", component: ProfileTab, enabled: false },
  { id: "api-keys", labelKey: "settings.tabs.apiKeys", icon: "OL_SHIELD_CHECK", component: ApiKeysTab, enabled: false },
  { id: "connections", labelKey: "settings.tabs.connections", icon: "OL_ARROW_UP_SQUARE", component: ConnectionsTab, enabled: false },
];

export const enabledSettingsTabs = (isAdmin = true) =>
  SETTINGS_TABS.filter((tab) => tab.enabled && (!tab.adminOnly || isAdmin));
