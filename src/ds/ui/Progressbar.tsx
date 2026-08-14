// 원본: TOAST asset/components/common/contents/Progressbar.tsx
// 변경: cn 임포트를 @/ds/lib/cn으로 교체. 클래스 리매핑 대상 없음
// (bg-neutral-lightMiddleGray, bg-primary는 팔레트 직접 클래스로 무변경).
import { cn } from '@/ds/lib/cn';

interface Props {
  value: number;
  trackClassname?: string;
  indicatorClassName?: string;
}

const Progressbar = (props: Props) => {
  return (
    <div
      className={cn('relative h-2.5 rounded-full bg-neutral-lightMiddleGray', props.trackClassname)}
    >
      <div
        className={cn(
          'absolute top-0 left-0 h-full rounded-full bg-primary',
          props.indicatorClassName,
        )}
        style={{ width: `${props.value}%` }}
      />
    </div>
  );
};

export default Progressbar;
