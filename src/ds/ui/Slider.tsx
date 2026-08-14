interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  label?: boolean;
  onChange: (value: number) => void;
}

const Slider = ({ value, min = 0, max = 100, label = false, onChange }: SliderProps) => {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative flex h-10 w-[300px] items-center">
      {label && <output className="absolute -top-5 -translate-x-1/2 rounded-control bg-[#222222] px-2 py-1 text-xs text-white" style={{ left: `${percent}%` }}>{value}</output>}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label="값"
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#ebeef1] accent-primary"
        style={{ background: `linear-gradient(to right, #1c6bff ${percent}%, #ebeef1 ${percent}%)` }}
      />
    </div>
  );
};

export default Slider;

interface RangeSliderProps {
  value: [number, number];
  min?: number;
  max?: number;
  onChange: (value: [number, number]) => void;
}

export const RangeSlider = ({ value, min = 0, max = 100, onChange }: RangeSliderProps) => {
  const start = ((value[0] - min) / (max - min)) * 100;
  const end = ((value[1] - min) / (max - min)) * 100;
  return (
    <div className="relative h-10 w-[300px]">
      <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-[#ebeef1]" />
      <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary" style={{ left: `${start}%`, right: `${100 - end}%` }} />
      {[0, 1].map((index) => (
        <input
          key={index}
          type="range"
          min={min}
          max={max}
          value={value[index]}
          aria-label={index === 0 ? '최솟값' : '최댓값'}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(index === 0 ? [Math.min(next, value[1]), value[1]] : [value[0], Math.max(next, value[0])]);
          }}
          className="pointer-events-none absolute top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent accent-primary [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
        />
      ))}
    </div>
  );
};
