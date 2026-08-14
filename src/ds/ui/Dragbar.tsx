// 원본: TOAST asset/components/common/contents/Dragbar.tsx
// 변경: cn→@/ds/lib/cn. IconCheckbox→@/ds/ui/IconCheckbox(이 웨이브 내 다른 작업으로 이식 완료된 모듈,
// 계약 동일해 그대로 참조).
// 클래스 리매핑: bg-white→bg-surface(트랙 눈금). 그 외(bg-primary, text-primary,
// bg-neutral-lightMiddleGray, text-neutral-middleGray, bg-neutral-middleGray, typo-*)는 표 대상 아니거나
// 무변경 그룹이라 그대로 둠.
import { cn } from '@/ds/lib/cn';
import IconCheckbox from '@/ds/ui/IconCheckbox';

type Range = { min: number; max: number };
export interface DragbarProps {
  id: string;
  name: string;
  value: number;
  useCheck?: boolean;
  disabled?: boolean;
  step?: number;
  range?: Range;
  onChange: (data: { id: string; value: number }) => void;
}

const clamp = (value: number, range: Range) => Math.min(Math.max(value, range.min), range.max);

const getRatio = (value: number, range: Range) => {
  const { min, max } = range;
  const total = max - min;
  if (total <= 0) return 0;

  return (value - min) / total;
};

const createMarks = (range: Range, step: number) => {
  const { min, max } = range;
  const total = max - min;

  if (total <= 0 || step <= 0) return [];

  const stepCount = Math.floor(total / step);
  const stepRatio = step / total;

  const marks = Array.from({ length: stepCount + 1 }, (_, i) => i * stepRatio);

  // 마지막이 1(=max)까지 안 가는 경우, 안전하게 max 지점 추가
  const last = marks.at(-1) ?? 0;
  if (Math.abs(last - 1) > 1e-6) {
    marks.push(1);
  }

  return marks;
};

const calcLeftPosition = (ratio: number): string => {
  if (ratio === 0) return '0';
  else if (ratio === 1) return `calc(${ratio * 100}% - ${DRAG_BALL_SIZE}px)`;
  else return `calc(${ratio * 100}% - ${DRAG_BALL_SIZE / 2}px)`;
};

const DRAG_BALL_SIZE = 14;
const DRAG_BALL_SIZE_PX = `${DRAG_BALL_SIZE}px`;

const Dragbar = ({
  id,
  name,
  value,
  useCheck = true,
  disabled = false,
  step = 0.2,
  range = {
    min: 0,
    max: 1,
  },
  onChange,
}: DragbarProps) => {
  const clampedValue = clamp(value, range);
  const ratio = getRatio(clampedValue, range);
  const marks = createMarks(range, step);

  return (
    <div className="py-3">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
          {useCheck && <IconCheckbox checked={disabled ? false : ratio !== 0} />}
          <span>{name}</span>
        </div>
        <span
          className={cn('typo-bold_smallP text-primary', disabled && 'text-neutral-middleGray')}
        >
          {range.max <= 1 ? clampedValue.toFixed(1) : clampedValue}
        </span>
      </div>

      <div className={cn(useCheck && 'ml-[30px]')}>
        <div className="relative h-6">
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-neutral-lightMiddleGray rounded-full -translate-y-1/2">
            <div
              className={cn(
                'relative top-0 left-0 h-2 bg-primary rounded-full',
                disabled && 'bg-neutral-middleGray',
              )}
              style={{ width: `${ratio * 100}%` }}
            />
            {marks.map((mark, index) => {
              if (index === 0) return;
              return (
                <div
                  key={`${mark}-${index}`}
                  className="absolute top-1/2 w-[1px] h-3 bg-surface -translate-y-1/2"
                  style={{ left: `${mark * 100}%` }}
                />
              );
            })}
          </div>
          <input
            type="range"
            min={range.min}
            max={range.max}
            step={step}
            value={clampedValue}
            onChange={(e) =>
              onChange({
                id,
                value: clamp(Number(e.target.value), range),
              })
            }
            className={cn(
              'absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer',
              disabled && 'cursor-default',
            )}
            disabled={disabled}
          />

          <div
            className={cn(
              'absolute top-1/2 rounded-full bg-primary shadow -translate-y-1/2 pointer-events-none',
              disabled && 'bg-neutral-middleGray',
            )}
            style={{
              width: DRAG_BALL_SIZE_PX,
              height: DRAG_BALL_SIZE_PX,
              left: calcLeftPosition(ratio),
            }}
          />
        </div>

        <div className="flex justify-between typo-regular_overline text-neutral-middleGray">
          <span>{range.min}</span>
          <span>{range.max}</span>
        </div>
      </div>
    </div>
  );
};

export default Dragbar;
