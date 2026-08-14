// 설정 다이얼로그 — 좌측 탭 레일 + 콘텐츠. studio의 구조(레일 다이얼로그·딥링크·마지막 탭 기억·포커스 복원)를
// 참조한 자체 구현(코드 복사 없음). 탭 구성은 settings-config.tsx 레지스트리가 단일 원천.
import { useEffect } from "react";
import { cn } from "@/ds/lib/cn";
import { getAppIcon } from "@/ds/icons";
import { useT } from "@/i18n";
import XButton from "@/ds/ui/XButton";
import { enabledSettingsTabs } from "./settings-config";
import { useSettingsUi } from "./settings-store";

export function SettingsDialog() {
  const t = useT();
  const { open, activeTab, setActiveTab, closeSettings } = useSettingsUi();
  const tabs = enabledSettingsTabs();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSettings();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeSettings]);

  if (!open) return null;

  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const ActiveComponent = active.component;

  return (
    <div
      className="fixed inset-0 z-[9980] flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
      onMouseDown={closeSettings}
      role="dialog"
      aria-modal="true"
      aria-label={t("settings.title")}
    >
      <div
        className={cn(
          "flex h-[560px] w-[min(820px,calc(100vw-2rem))] overflow-hidden rounded-panel border border-line bg-surface shadow-basic",
          "max-sm:h-dvh max-sm:w-dvw max-sm:flex-col max-sm:rounded-none",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <aside className="flex w-[216px] shrink-0 flex-col border-r border-line/60 bg-surface-page/40 p-3 max-sm:w-full max-sm:flex-row max-sm:items-center max-sm:overflow-x-auto max-sm:border-r-0 max-sm:border-b">
          <h2 className="px-2.5 pb-3 pt-2 typo-bold_P text-fg max-sm:hidden">{t("settings.title")}</h2>
          <nav className="flex flex-col gap-0.5 max-sm:flex-row">
            {tabs.map((tab) => {
              const isActive = tab.id === active.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-full py-1.5 pl-3 pr-2.5 typo-semiBold_smalllP transition-colors max-sm:shrink-0",
                    isActive
                      ? "bg-accent-bg text-fg"
                      : "text-fg-muted hover:bg-neutral-lightGray hover:text-fg",
                  )}
                >
                  {getAppIcon(tab.icon, {
                    size: 17,
                    colorClass: isActive ? "text-accent" : "text-fg-subtle",
                  })}
                  <span className="min-w-0 truncate">{t(tab.labelKey)}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="absolute right-3 top-3 z-10">
            <XButton onClick={closeSettings} colorClass="text-neutral-middleGray" size={20} />
          </div>
          <div className="scrollbar-default min-h-0 flex-1 overflow-y-auto p-6 [scrollbar-gutter:stable]">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
