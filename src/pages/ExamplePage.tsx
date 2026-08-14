// 적용 예시 — 컴포넌트 조립 + 백엔드 실연동(SSE·/api) 레퍼런스.
// 카탈로그(부품 전시)와 달리 완성 화면 조립법과 풀서킷 동작을 보여준다. 새 서비스는 이 페이지를 홈으로 교체.
import { useMemo, useState } from "react";
import { useT } from "@/i18n";
import { getAppIcon } from "@/ds/icons";
import { cn } from "@/ds/lib/cn";
import DataTable from "@/ds/ui/DataTable";
import Badge from "@/ds/ui/Badge";
import EChart from "@/ds/ui/EChart";
import { useChartColors, withAlpha } from "@/ds/hooks/useChartColors";
import LogStreamPanel from "@/app/LogStreamPanel";

interface JobRow {
  id: string;
  name: string;
  model: string;
  status: "running" | "done" | "failed";
  updatedAt: string;
}

const JOB_ROWS: JobRow[] = [
  { id: "j1", name: "exaone-sft-0811", model: "EXAONE-4.5-33B", status: "running", updatedAt: "2026-08-11 10:22" },
  { id: "j2", name: "qwen-dpo-batch2", model: "H100-Qwen3.6", status: "done", updatedAt: "2026-08-11 09:40" },
  { id: "j3", name: "judge-calibration", model: "bge-m3 + judge", status: "failed", updatedAt: "2026-08-10 18:03" },
  { id: "j4", name: "voxcpm-finetune", model: "VoxCPM", status: "done", updatedAt: "2026-08-09 14:12" },
];

// 학습 손실 데모 시리즈 (고정 데이터 — SSE 실측 연동은 잡 패널 단계에서)
const LOSS_STEPS = Array.from({ length: 60 }, (_, i) => i * 50);
const LOSS_VALUES = LOSS_STEPS.map((s) => +(2.4 * Math.exp(-s / 900) + 0.35 + 0.05 * Math.sin(s / 120)).toFixed(3));

function StatusBadge({ status }: Readonly<{ status: JobRow["status"] }>) {
  const styles = {
    running: "bg-accent-bg text-accent border border-accent/30",
    done: "bg-success-bg text-success border border-success/30",
    failed: "bg-danger-bg text-danger border border-danger/30",
  } as const;
  const labels = { running: "실행 중", done: "완료", failed: "실패" } as const;
  return <Badge name={labels[status]} className={cn("border", styles[status])} />;
}

const JOB_COLUMNS = [
  { accessorKey: "name", header: "작업명", meta: { width: "30%" } },
  { accessorKey: "model", header: "모델", meta: { width: "24%" } },
  {
    accessorKey: "status",
    header: "상태",
    cell: (ctx: any) => <StatusBadge status={ctx.getValue()} />,
    meta: { width: "16%" },
  },
  { accessorKey: "updatedAt", header: "갱신 시각" },
];

export default function ExamplePage() {
  const t = useT();
  const colors = useChartColors();
  const [selected, setSelected] = useState<string[]>([]);

  const lossOption = useMemo(
    () => ({
      grid: { left: 48, right: 16, top: 24, bottom: 28 },
      xAxis: { type: "category" as const, data: LOSS_STEPS, name: "step" },
      yAxis: { type: "value" as const },
      tooltip: { trigger: "axis" as const },
      series: [
        {
          type: "line" as const,
          data: LOSS_VALUES,
          smooth: true,
          showSymbol: false,
          // 색은 토큰 훅에서 — 브랜드·다크 전환 자동 추종 (하드코딩 금지, GUIDE '차트' 참조)
          lineStyle: { color: colors.primary, width: 2 },
          areaStyle: { color: withAlpha(colors.primary, 0.08) },
        },
      ],
    }),
    [colors],
  );

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-8 py-8">
      {/* 역할 안내 배너 — 이 페이지의 정체 (A안, 2026-08-12) */}
      <div className="flex items-start gap-3 rounded-panel border border-primary-light bg-accent-bg px-5 py-4">
        {getAppIcon("OL_QUESTION_MARK_CIRCLE", { size: 20, colorClass: "text-accent" })}
        <div className="flex flex-col gap-0.5">
          <span className="typo-semiBold_smalllP text-fg">이 페이지는 적용 예시입니다</span>
          <span className="typo-regular_caption text-fg-muted">
            컴포넌트를 실제 화면으로 조립하고 백엔드와 실연동(SSE 로그·/api)하는 레퍼런스입니다. 카탈로그가
            부품 전시라면 여기는 완성 화면 예시 — 새 서비스에서는 이 페이지를 서비스 홈으로 교체하세요.
            소스: <code>src/pages/ExamplePage.tsx</code>
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="typo-bold_bigP text-fg">{t("page.dashboard.metrics")}</h2>
        <div className="rounded-panel border border-line bg-surface p-4">
          <EChart option={lossOption} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="typo-bold_bigP text-fg">잡 로그 (SSE 데모)</h2>
        <LogStreamPanel path="/api/jobs/j1/logs" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="typo-bold_bigP text-fg">{t("page.dashboard.jobs")}</h2>
        <DataTable
          columns={JOB_COLUMNS}
          cellData={JOB_ROWS}
          isEmpty={false}
          isError={false}
          selectedRows={selected}
          getRowId={(row) => row.id}
          onRowClick={(row) =>
            setSelected((prev) =>
              prev.includes(row.id) ? prev.filter((id) => id !== row.id) : [...prev, row.id],
            )
          }
        />
      </section>
    </div>
  );
}
