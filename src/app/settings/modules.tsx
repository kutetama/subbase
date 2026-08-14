// 옵션 모듈 탭 — 프로필/API 키/연결. 기본 비활성(설정 config에서 enabled로 켬 — 빌드타임 구성).
// 활성화돼도 컨트롤은 항상 렌더한다 (환경값 감지로 숨기지 않음 — 컨트롤 상시 렌더 원칙).
import { useT } from "@/i18n";
import { SettingsSection, SettingsRow } from "./primitives";

function TabHeader({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <header className="flex flex-col gap-1">
      <h2 className="typo-semiBold_h3 text-fg">{title}</h2>
      <p className="typo-regular_caption text-fg-subtle">{description}</p>
    </header>
  );
}

export function ProfileTab() {
  const t = useT();
  return (
    <div className="flex flex-col gap-6">
      <TabHeader title={t("settings.profile.title")} description={t("settings.profile.description")} />
      <SettingsSection title={t("settings.profile.title")}>
        <SettingsRow label="—" description="인증 도입 시 계정·비밀번호 변경 UI가 이 자리에 구현됩니다." />
      </SettingsSection>
    </div>
  );
}

export function ApiKeysTab() {
  const t = useT();
  return (
    <div className="flex flex-col gap-6">
      <TabHeader title={t("settings.apiKeys.title")} description={t("settings.apiKeys.description")} />
      <SettingsSection title={t("settings.apiKeys.title")}>
        <SettingsRow label="—" description="키 목록·생성 폼·1회 노출 카드가 이 자리에 구현됩니다." />
      </SettingsSection>
    </div>
  );
}

export function ConnectionsTab() {
  const t = useT();
  return (
    <div className="flex flex-col gap-6">
      <TabHeader
        title={t("settings.connections.title")}
        description={t("settings.connections.description")}
      />
      <SettingsSection title={t("settings.connections.title")}>
        <SettingsRow label="—" description="엔드포인트 등록·헬스체크 UI가 이 자리에 구현됩니다." />
      </SettingsSection>
    </div>
  );
}
