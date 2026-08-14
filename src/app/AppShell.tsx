// 앱 셸 — config 선언형 사이드바(활성 표시·접힘) + 헤더 + 콘텐츠 아울렛 + 전역 인스턴스 마운트.
import { Suspense } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Tooltip as ReactTooltipInstance } from "react-tooltip";

import { cn } from "@/ds/lib/cn";
import { getAppIcon } from "@/ds/icons";
import { useT } from "@/i18n";
import { useThemeStore } from "@/ds/providers/theme-store";
import { useUiStore } from "@/app/ui-store";
import { NAV_SECTIONS } from "@/app/nav-config";
import { SettingsDialog } from "@/app/settings/SettingsDialog";
import { useSettingsUi } from "@/app/settings/settings-store";
import "@/ds/styles/react-toastify.css";
import "@/ds/styles/react-tooltip.css";

export default function AppShell() {
  const t = useT();
  const { sidebarCompact } = useUiStore();
  const { resolved, setMode } = useThemeStore();
  const openSettings = useSettingsUi((s) => s.openSettings);
  const location = useLocation();

  const currentLabelKey = NAV_SECTIONS.flatMap((s) => s.items).find(
    (item) => item.path === location.pathname,
  )?.labelKey;

  return (
    <div className="flex min-h-dvh bg-surface-page text-fg">
      {/* 사이드바 — aside 250px (제품 치수 토큰), 접힘 시 64px */}
      <aside
        className={cn(
          "sticky top-0 flex h-dvh shrink-0 flex-col border-r border-line/60 bg-surface transition-[width]",
          sidebarCompact ? "w-[64px]" : "w-[250px] max-md:w-[64px]", // w-aside
        )}
      >
        <NavLink to="/" aria-label="subBase 홈" className={cn("flex h-[60px] items-center gap-2.5 px-5 max-md:justify-center max-md:px-0", sidebarCompact && "justify-center px-0")}>
          <span className="flex size-7 items-center justify-center rounded-control bg-primary text-white typo-bold_smallP">
            sB
          </span>
          {!sidebarCompact && <span className="typo-bold_P text-fg max-md:hidden">subBase</span>}
        </NavLink>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4 max-md:px-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.titleKey ?? section.items[0]?.path} className="flex flex-col gap-1">
              {section.titleKey && !sidebarCompact && (
                <span className="px-3 pb-1 typo-bold_overline uppercase tracking-wide text-fg-subtle max-md:hidden">
                  {t(section.titleKey)}
                </span>
              )}
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  title={t(item.labelKey)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-control px-3 py-2 typo-semiBold_smalllP transition-colors",
                      sidebarCompact && "justify-center px-0",
                      "max-md:justify-center max-md:px-0",
                      isActive
                        ? "bg-accent-bg text-fg"
                        : "text-fg-muted hover:bg-neutral-lightGray hover:text-fg",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {getAppIcon(item.icon, {
                        size: 19,
                        colorClass: isActive ? "text-accent" : "text-fg-subtle",
                      })}
                      {!sidebarCompact && <span className="min-w-0 truncate max-md:hidden">{t(item.labelKey)}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className={cn("border-t border-line/60 p-3 max-md:flex max-md:justify-center max-md:px-2", sidebarCompact && "flex justify-center")}>
          <button
            type="button"
            onClick={() => openSettings()}
            title={t("shell.openSettings")}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-control px-3 py-2 typo-semiBold_smalllP text-fg-muted transition-colors hover:bg-neutral-lightGray hover:text-fg",
              sidebarCompact && "w-auto justify-center px-2",
              "max-md:w-auto max-md:justify-center max-md:px-2",
            )}
          >
            {getAppIcon("OL_COG_6_TOOTH", { size: 19, colorClass: "text-fg-subtle" })}
            {!sidebarCompact && <span className="max-md:hidden">{t("settings.title")}</span>}
          </button>
        </div>
      </aside>

      {/* 본문 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[60px] shrink-0 items-center justify-between border-b border-line/60 bg-surface px-6">
          <h1 className="typo-bold_P text-fg">{currentLabelKey ? t(currentLabelKey) : ""}</h1>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMode(resolved === "dark" ? "light" : "dark")}
              title={t("shell.toggleTheme")}
              className="flex size-9 cursor-pointer items-center justify-center rounded-control text-fg-muted transition-colors hover:bg-neutral-lightGray hover:text-fg"
            >
              {getAppIcon(resolved === "dark" ? "OL_SPARKLES" : "OL_HAPPY", { size: 18 })}
            </button>
            <button
              type="button"
              onClick={() => openSettings()}
              title={t("shell.openSettings")}
              className="flex size-9 cursor-pointer items-center justify-center rounded-control text-fg-muted transition-colors hover:bg-neutral-lightGray hover:text-fg"
            >
              {getAppIcon("OL_COG_6_TOOTH", { size: 18 })}
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1">
          <Suspense
            fallback={
              <output className="flex min-h-[240px] items-center justify-center" aria-label="페이지 불러오는 중">
                <span className="size-6 animate-spin rounded-full border-2 border-line border-t-primary" />
              </output>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* 전역 오버레이·인스턴스 */}
      <SettingsDialog />
      <ToastContainer
        className="app-toast"
        position="bottom-center"
        hideProgressBar
        closeButton={false}
        autoClose={2000}
      />
      <ReactTooltipInstance id="app-tooltip" className="app-react-tooltip" />
    </div>
  );
}
