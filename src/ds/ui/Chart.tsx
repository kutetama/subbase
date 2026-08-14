import EChart, { type EChartOption } from '@/ds/ui/EChart';

export type ChartType = 'bar' | 'group-bar' | 'bar-line' | 'group-line' | 'lollipop' | 'stacked-line' | 'donut' | 'gauge';

interface ChartProps {
  type?: ChartType;
  values?: number[];
  secondaryValues?: number[];
  labels?: string[];
  className?: string;
}

const createSpecialOption = (type: ChartType, values: number[], labels: string[]): EChartOption | undefined => {
  if (type === 'donut') return { series: [{ type: 'pie', radius: ['50%', '72%'], data: values.map((value, index) => ({ value, name: labels[index] })) }] };
  if (type === 'gauge') return { series: [{ type: 'gauge', progress: { show: true, width: 12 }, axisLine: { lineStyle: { width: 12 } }, data: [{ value: values[0] ?? 0 }], detail: { fontSize: 18 } }] };
  return undefined;
};

const usesSecondSeries = (type: ChartType) => ['group-bar', 'group-line', 'stacked-line', 'bar-line'].includes(type);

const Chart = ({
  type = 'bar',
  values = [42, 68, 51, 86, 73],
  secondaryValues = [28, 54, 63, 58, 81],
  labels = ['A', 'B', 'C', 'D', 'E'],
  className,
}: ChartProps) => {
  const palette = ['#1c6bff', '#e1ebff', '#244bd7', '#ebf1fd', '#00bb2a', '#f9a80c', '#ff881a', '#ee4700'];
  const axis = {
    xAxis: { type: 'category' as const, data: labels, axisLine: { lineStyle: { color: '#ebeef1' } }, axisTick: { show: false } },
    yAxis: { type: 'value' as const, splitLine: { lineStyle: { color: '#f2f4f8' } } },
  };
  let option: EChartOption;

  const specialOption = createSpecialOption(type, values, labels);
  if (specialOption) {
    option = specialOption;
  } else if (type === 'lollipop') {
    option = { ...axis, series: [{ type: 'bar', data: values, barWidth: 3, itemStyle: { color: '#1c6bff' } }, { type: 'scatter', data: values, symbolSize: 12, itemStyle: { color: '#1c6bff' } }] };
  } else {
    const line = type === 'group-line' || type === 'stacked-line';
    option = {
      ...axis,
      color: palette,
      series: [
        { type: line ? 'line' : 'bar', data: values, smooth: line, stack: type === 'stacked-line' ? 'total' : undefined, barMaxWidth: 24 },
        ...(usesSecondSeries(type)
          ? [{ type: type === 'bar-line' || line ? 'line' as const : 'bar' as const, data: secondaryValues, smooth: line, stack: type === 'stacked-line' ? 'total' : undefined, barMaxWidth: 24 }]
          : []),
      ],
    };
  }

  return <EChart option={{ animationDuration: 300, color: palette, grid: { left: 36, right: 12, top: 16, bottom: 28 }, ...option }} className={className} />;
};

export default Chart;
