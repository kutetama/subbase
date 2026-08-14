// EChart 래퍼 — echarts 인스턴스 수명주기(초기화·리사이즈·폐기)와 테마 연동을 캡슐화 (STACK.md 차트 확정).
// AutoJudge의 EChart 래퍼 패턴 계승(유저 소유 코드) — 옵션은 호출부가 소유, 래퍼는 수명주기만.
//
// echarts/core + 명시 등록. `import * as echarts from "echarts"`는 지도·3D·간트·달력까지
// 전부 싣는다 — 소비자 번들에서 +1.1MB로 측정됐다. 아래 use() 목록이 이 DS가 지원하는
// 차트의 범위다. 등록하지 않은 series.type이나 컴포넌트는 에러 없이 그냥 그려지지 않으므로,
// 새 타입이 필요하면 여기에 등록과 ComposeOption 타입을 함께 추가한다.
import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart, GaugeChart, LineChart, PieChart, ScatterChart } from "echarts/charts";
import type {
  BarSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
} from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import type {
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { cn } from "@/ds/lib/cn";
import { useThemeStore } from "@/ds/providers/theme-store";

echarts.use([
  LineChart,
  BarChart,
  GaugeChart,
  PieChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  // 손실 차트의 평균선처럼 기준선을 긋는 용도. series 옵션에 얹히므로 별도 옵션 타입은 없다.
  MarkLineComponent,
  CanvasRenderer,
]);

/** 등록된 차트·컴포넌트에 맞춘 옵션 타입. use()에 무언가를 추가하면 여기에도 더한다. */
export type EChartOption = ComposeOption<
  | LineSeriesOption
  | BarSeriesOption
  | GaugeSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | TitleComponentOption
>;

interface Props {
  option: EChartOption;
  className?: string;
}

const EChart = ({ option, className }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const resolved = useThemeStore((s) => s.resolved);

  // 테마가 바뀌면 재초기화한다. echarts의 내장 테마를 쓰지 않는 것은 의도다 —
  // 색은 호출부가 토큰 훅에서 받아 option에 넣고(GUIDE '차트'), 내장 테마를 얹으면
  // 그것과 싸운다. 여기서 resolved를 구독하는 이유는 재초기화 트리거뿐이다.
  // (이전 구현은 init에 "dark"를 넘겼지만 그 테마를 등록한 적이 없어 무시되고 있었다.)
  useEffect(() => {
    if (!containerRef.current) return;
    chartRef.current?.dispose();
    chartRef.current = echarts.init(containerRef.current);
    chartRef.current.setOption({ backgroundColor: "transparent", ...option });

    const observer = new ResizeObserver(() => chartRef.current?.resize());
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- option 갱신은 아래 effect가 담당
  }, [resolved]);

  useEffect(() => {
    chartRef.current?.setOption({ backgroundColor: "transparent", ...option });
  }, [option]);

  return <div ref={containerRef} className={cn("h-[280px] w-full", className)} />;
};

export default EChart;
