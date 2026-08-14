// 설정 패널 프리미티브 — Section(제목·설명·행 묶음) / Row(라벨·설명·우측 컨트롤).
// 3앱(studio·subBaseER·AutoJudge)이 각자 재발명했던 구조의 표준화 — studio 구조 참조 자체 구현(코드 복사 없음).
import type { ReactNode } from "react";
import { cn } from "@/ds/lib/cn";

export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col">
      <div className="mb-1 flex flex-col gap-0.5">
        <h3 className="typo-bold_smallP text-fg">{title}</h3>
        {description ? (
          <p className="typo-regular_caption text-fg-subtle">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-col divide-y divide-line/60">{children}</div>
    </section>
  );
}

export function SettingsRow({
  label,
  description,
  destructive,
  alignTop,
  children,
}: {
  label: string;
  description?: ReactNode;
  /** 위험 액션 행 — 상단 구분선으로 분리 */
  destructive?: boolean;
  /** 설명이 길어 컨트롤을 첫 줄에 정렬해야 할 때 */
  alignTop?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex justify-between gap-6 py-3",
        alignTop ? "items-start" : "items-center",
        destructive && "mt-2 border-t border-line/60 pt-4",
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className={cn("typo-semiBold_smalllP", destructive ? "text-danger" : "text-fg")}>
          {label}
        </span>
        {description ? (
          <span className="typo-regular_caption text-fg-subtle leading-snug">{description}</span>
        ) : null}
      </div>
      {children ? <div className="flex shrink-0 items-center">{children}</div> : null}
    </div>
  );
}

/** 라이트/다크/시스템 등 소형 세그먼트 컨트롤 */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex rounded-control border border-line bg-surface-page p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "cursor-pointer rounded-[8px] px-3 py-1 typo-semiBold_smaller transition-colors",
            value === opt.value
              ? "bg-surface text-fg shadow-shadow1"
              : "text-fg-subtle hover:text-fg",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
