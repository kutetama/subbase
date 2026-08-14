// 디자인 카탈로그 공용 — 페이지 셸·패널·행·스와치·데모 데이터.
// 카탈로그 페이지 구성 규칙(GUIDE.md): 이식·신규 컴포넌트는 해당 카테고리 페이지에 등재해야 완료.
import type { ReactNode } from "react";
import { cn } from "@/ds/lib/cn";
import Badge from "@/ds/ui/Badge";
import type { TabProps } from "@/ds/ui/Tabs";
import type { IdNameSearchBoxProps } from "@/ds/ui/SearchBoxSelectedItem";

export function PageShell({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex max-w-[980px] flex-col gap-8 px-8 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="typo-bold_bigP text-fg">{title}</h1>
        {note ? <p className="typo-regular_caption text-fg-subtle">{note}</p> : null}
      </header>
      {children}
    </main>
  );
}

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <h2 className="typo-bold_P text-fg">{title}</h2>
        {note ? <span className="typo-regular_caption text-fg-subtle">{note}</span> : null}
      </div>
      {children}
    </section>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-panel border border-line bg-surface px-6 py-5", className)}>
      {children}
    </div>
  );
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-[130px] shrink-0 typo-regular_caption text-fg-subtle">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function Swatches({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([name, cls]) => (
        <div key={name} className="flex w-[92px] flex-col items-center gap-1">
          <div className={cn("h-10 w-full rounded-control", cls)} />
          <span className="typo-regular_overline text-fg-subtle break-all text-center">{name}</span>
        </div>
      ))}
    </div>
  );
}

// ── 데모 데이터 ──────────────────────────────────────────────
export interface JobRow {
  id: string;
  name: string;
  model: string;
  status: "running" | "done" | "failed";
  updatedAt: string;
}

export const JOB_ROWS: JobRow[] = [
  { id: "j1", name: "exaone-sft-0811", model: "EXAONE-4.5-33B", status: "running", updatedAt: "2026-08-11 10:22" },
  { id: "j2", name: "qwen-dpo-batch2", model: "H100-Qwen3.6", status: "done", updatedAt: "2026-08-11 09:40" },
  { id: "j3", name: "judge-calibration", model: "bge-m3 + judge", status: "failed", updatedAt: "2026-08-10 18:03" },
  { id: "j4", name: "voxcpm-finetune", model: "VoxCPM", status: "done", updatedAt: "2026-08-09 14:12" },
  { id: "j5", name: "subbase-regression", model: "LlamaFactory", status: "running", updatedAt: "2026-08-08 11:55" },
];

export const MODEL_OPTIONS = [
  { id: "m1", name: "EXAONE-4.5-33B" },
  { id: "m2", name: "H100-Qwen3.6" },
  { id: "m3", name: "VoxCPM" },
  { id: "m4", name: "bge-m3" },
];

export const SEARCH_POOL: IdNameSearchBoxProps[] = [
  { id: "s1", name: "exaone-sft-0811", description: "SFT 파인튜닝 잡" },
  { id: "s2", name: "qwen-dpo-batch2", description: "DPO 배치 2차" },
  { id: "s3", name: "judge-calibration", description: "저지 캘리브레이션" },
  { id: "s4", name: "voxcpm-finetune", description: "TTS 파인튜닝" },
];

export const DEMO_TABS: TabProps[] = [
  { display: "개요", code: "overview" },
  { display: "메트릭", code: "metrics" },
  { display: "로그", code: "logs" },
];

export function StatusBadge({ status }: { status: JobRow["status"] }) {
  const styles = {
    running: "bg-accent-bg text-accent border border-accent/30",
    done: "bg-success-bg text-success border border-success/30",
    failed: "bg-danger-bg text-danger border border-danger/30",
  } as const;
  const labels = { running: "실행 중", done: "완료", failed: "실패" } as const;
  return <Badge name={labels[status]} className={cn("border", styles[status])} />;
}

export const SEMANTIC_SWATCHES = [
  ["surface", "bg-surface border border-line"],
  ["surface-page", "bg-surface-page border border-line"],
  ["fg", "bg-fg"],
  ["fg-muted", "bg-fg-muted"],
  ["fg-subtle", "bg-fg-subtle"],
  ["line", "bg-line"],
  ["accent", "bg-accent"],
  ["accent-bg", "bg-accent-bg border border-line"],
  ["danger", "bg-danger"],
  ["danger-bg", "bg-danger-bg border border-line"],
  ["success", "bg-success"],
  ["success-bg", "bg-success-bg border border-line"],
] as const;

export const PALETTE_SWATCHES = [
  ["primary", "bg-primary"],
  ["primary-dark", "bg-primary-dark"],
  ["primary-light", "bg-primary-light"],
  ["primary-lightBg", "bg-primary-lightBg"],
  ["primary-bg", "bg-primary-bg border border-line"],
  ["third-1", "bg-third-1"],
  ["third-2", "bg-third-2"],
  ["third-3", "bg-third-3"],
  ["third-4", "bg-third-4"],
  ["third-5", "bg-third-5"],
  ["third-6", "bg-third-6"],
  ["third-7", "bg-third-7"],
  ["third-8", "bg-third-8"],
  ["neutral-black", "bg-neutral-black"],
  ["neutral-darkGray", "bg-neutral-darkGray"],
  ["neutral-middleGray", "bg-neutral-middleGray"],
  ["neutral-lightGray", "bg-neutral-lightGray border border-line"],
  ["semantic-error", "bg-semantic-error"],
  ["semantic-caution", "bg-semantic-caution"],
  ["semantic-success", "bg-semantic-success"],
  ["semantic-lineGray", "bg-semantic-lineGray"],
] as const;

export const TYPO_SAMPLES = [
  "typo-regular_overline",
  "typo-regular_caption",
  "typo-regular_smaller",
  "typo-regular_smalllP",
  "typo-medium_smaller",
  "typo-semiBold_smaller",
  "typo-semiBold_smalllP",
  "typo-bold_overline",
  "typo-bold_caption",
  "typo-bold_smaller",
  "typo-bold_smallP",
  "typo-bold_SemiSmallP",
  "typo-bold_P",
  "typo-bold_bigP",
  "typo-semiBold_h3",
  "typo-bold_bigger",
  "typo-bold_h2",
  "typo-bold_biggest",
  "typo-bold_display",
];
