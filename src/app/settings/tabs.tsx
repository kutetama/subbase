// 공통 설정 4탭 — 일반·모양·시스템·정보 (3앱 교차 검증으로 확정된 공통분모, BRIEF 부록 A).
import { useCallback, useEffect, useState } from "react";

import { useT } from "@/i18n";
import { apiFetch } from "@/lib/api";
import { resetLocalPreferences, useUiStore } from "@/app/ui-store";
import { useThemeStore, type ThemeMode } from "@/ds/providers/theme-store";
import { useBrandStore, BRANDS, RUNTIME_BRANDS_ENABLED } from "@/ds/providers/brand-store";
import { useI18nStore, type Locale } from "@/i18n";

import SelectBox from "@/ds/ui/SelectBox";
import Switch from "@/ds/ui/Switch";
import TextButton from "@/ds/ui/TextButton";
import FetchStatusGate from "@/ds/biz/FetchStatusGate";
import { SettingsRow, SettingsSection, Segmented } from "./primitives";

function TabHeader({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <header className="flex flex-col gap-1">
      <h2 className="typo-semiBold_h3 text-fg">{title}</h2>
      <p className="typo-regular_caption text-fg-subtle">{description}</p>
    </header>
  );
}

// ── 일반 ─────────────────────────────────────────────────────
const NOTIFY_KEY = "subbase.notifyJobDone";

export function GeneralTab() {
  const t = useT();
  const [notify, setNotify] = useState(() => {
    try {
      return window.localStorage.getItem(NOTIFY_KEY) !== "0";
    } catch {
      return true;
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <TabHeader title={t("settings.general.title")} description={t("settings.general.description")} />

      <SettingsSection title={t("settings.general.notifications.title")}>
        <SettingsRow
          label={t("settings.general.notifyJobDone")}
          description={t("settings.general.notifyJobDoneDescription")}
        >
          <Switch
            on={notify}
            onChange={(on) => {
              setNotify(on);
              try {
                window.localStorage.setItem(NOTIFY_KEY, on ? "1" : "0");
              } catch {
                /* 무시 */
              }
            }}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={t("settings.general.reset.title")}>
        <SettingsRow
          destructive
          label={t("settings.general.resetPreferences")}
          description={t("settings.general.resetPreferencesDescription")}
        >
          <TextButton name={t("settings.general.resetButton")} size="fit" onClick={resetLocalPreferences} />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}

// ── 모양 ─────────────────────────────────────────────────────
export function AppearanceTab() {
  const t = useT();
  const { mode, setMode } = useThemeStore();
  const { brand, setBrand } = useBrandStore();
  const { locale, setLocale } = useI18nStore();
  const { sidebarCompact, setSidebarCompact } = useUiStore();

  const localeOptions = [
    { id: "ko", name: "한국어" },
    { id: "en", name: "English" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <TabHeader
        title={t("settings.appearance.title")}
        description={t("settings.appearance.description")}
      />

      <SettingsSection title={t("settings.appearance.theme.title")}>
        <SettingsRow
          label={t("settings.appearance.theme.label")}
          description={t("settings.appearance.theme.description")}
        >
          <Segmented<ThemeMode>
            value={mode}
            onChange={setMode}
            options={[
              { value: "light", label: t("settings.appearance.theme.light") },
              { value: "dark", label: t("settings.appearance.theme.dark") },
              { value: "system", label: t("settings.appearance.theme.system") },
            ]}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={t("settings.appearance.brand.title")}>
        <SettingsRow
          label={t("settings.appearance.brand.label")}
          description={
            RUNTIME_BRANDS_ENABLED
              ? t("settings.appearance.brand.description")
              : t("settings.appearance.brand.disabledHint")
          }
        >
          <div className="w-[200px]">
            <SelectBox
              selectList={BRANDS.map((b) => ({ id: b, name: b }))}
              selectedId={brand}
              disabled={!RUNTIME_BRANDS_ENABLED}
              onChange={(el) => setBrand(el.id)}
            />
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={t("settings.appearance.language.title")}>
        <SettingsRow
          label={t("settings.appearance.language.label")}
          description={t("settings.appearance.language.description")}
        >
          <div className="w-[180px]">
            <SelectBox
              selectList={localeOptions}
              selectedId={locale}
              onChange={(el) => setLocale(el.id as Locale)}
            />
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={t("settings.appearance.layout.title")}>
        <SettingsRow
          label={t("settings.appearance.compactSidebar")}
          description={t("settings.appearance.compactSidebarDescription")}
        >
          <Switch on={sidebarCompact} onChange={setSidebarCompact} />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}

// ── 시스템 ───────────────────────────────────────────────────
interface SystemInfo {
  version: string;
  uptime: string;
  platform: string;
  gpus: string[];
  dataDir: string;
}

export function SystemTab() {
  const t = useT();
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    apiFetch<SystemInfo>("/api/system")
      .then(setInfo)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  return (
    <div className="flex flex-col gap-6">
      <TabHeader title={t("settings.system.title")} description={t("settings.system.description")} />

      <FetchStatusGate
        loading={loading}
        error={error}
        errorMessage={t("settings.system.fetchError")}
        retryCallback={load}
      >
        {info && (
          <div className="flex flex-col gap-6">
            <SettingsSection title={t("settings.system.backend.title")}>
              <SettingsRow label={t("settings.system.version")}>
                <span className="typo-regular_smalllP text-fg-muted">{info.version}</span>
              </SettingsRow>
              <SettingsRow label={t("settings.system.uptime")}>
                <span className="typo-regular_smalllP text-fg-muted">{info.uptime}</span>
              </SettingsRow>
              <SettingsRow label={t("settings.system.platform")}>
                <span className="typo-regular_smalllP text-fg-muted">{info.platform}</span>
              </SettingsRow>
            </SettingsSection>
            <SettingsSection title={t("settings.system.hardware.title")}>
              <SettingsRow label={t("settings.system.gpu")} alignTop>
                <div className="flex flex-col items-end gap-0.5">
                  {info.gpus.length ? (
                    info.gpus.map((gpu) => (
                      <span key={gpu} className="typo-regular_smalllP text-fg-muted">
                        {gpu}
                      </span>
                    ))
                  ) : (
                    <span className="typo-regular_smalllP text-fg-subtle">—</span>
                  )}
                </div>
              </SettingsRow>
            </SettingsSection>
            <SettingsSection title={t("settings.system.storage.title")}>
              <SettingsRow label={t("settings.system.dataDir")}>
                <code className="typo-regular_caption text-fg-muted">{info.dataDir}</code>
              </SettingsRow>
            </SettingsSection>
          </div>
        )}
      </FetchStatusGate>
    </div>
  );
}

// ── 정보 ─────────────────────────────────────────────────────
export function AboutTab() {
  const t = useT();
  return (
    <div className="flex flex-col gap-6">
      <TabHeader title={t("settings.about.title")} description={t("settings.about.description")} />

      <SettingsSection title={t("settings.about.version.title")}>
        <SettingsRow label={t("settings.about.appVersion")}>
          <code className="typo-regular_smalllP text-fg-muted">v{__APP_VERSION__}</code>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={t("settings.about.docs.title")}>
        <SettingsRow
          label={t("settings.about.designGuide")}
          description={t("settings.about.designGuideDescription")}
        />
      </SettingsSection>

      <SettingsSection title={t("settings.about.license.title")}>
        <SettingsRow label={t("settings.about.licenseNotice")} />
      </SettingsSection>
    </div>
  );
}
