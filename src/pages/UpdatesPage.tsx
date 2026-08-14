// 업데이트 — 버전 히스토리 전용 페이지 (사이드바 메뉴).
// 데이터 원천은 app/version-history.ts (정보 탭 버전 표기·CHANGELOG.md와 동일 체계 — 릴리스 절차는 npm run bump).
import { VERSION_HISTORY } from "@/app/version-history";
import Badge from "@/ds/ui/Badge";

export default function UpdatesPage() {
  return (
    <main className="mx-auto flex max-w-[820px] flex-col gap-6 px-8 py-10">
      <header className="flex items-center gap-3">
        <h1 className="typo-bold_bigP text-fg">업데이트</h1>
        <Badge name={`현재 v${__APP_VERSION__}`} className="bg-accent-bg text-accent border border-accent/30" />
      </header>

      <div className="flex flex-col gap-4">
        {VERSION_HISTORY.map((entry) => {
          const isCurrent = entry.version === __APP_VERSION__;
          return (
            <section
              key={entry.version}
              className={`flex flex-col gap-2.5 rounded-panel border bg-surface px-6 py-5 ${
                isCurrent ? "border-primary-light" : "border-line"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Badge
                  name={`v${entry.version}`}
                  className={
                    isCurrent
                      ? "bg-primary text-white"
                      : "bg-neutral-lightGray text-fg-muted"
                  }
                />
                <span className="typo-regular_caption text-fg-subtle">{entry.date}</span>
                {isCurrent && <span className="typo-bold_caption text-accent">현재 버전</span>}
              </div>
              <ul className="flex list-disc flex-col gap-1 pl-5">
                {entry.notes.map((note) => (
                  <li key={note} className="typo-regular_smalllP text-fg-muted">
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="typo-regular_caption text-fg-subtle">
        릴리스 절차: <code>npm run bump -- &lt;full|major|minor&gt;</code> → 스텁 기입 → 커밋 →{" "}
        <code>git tag vX.Y.Z</code> (버전 체계는 CHANGELOG.md 상단)
      </p>
    </main>
  );
}
