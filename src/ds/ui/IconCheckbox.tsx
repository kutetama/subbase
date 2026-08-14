// 원본: TOAST asset/components/common/icon/IconCheckbox.tsx
// 변경: cn/getAppIcon 임포트를 @/ds/lib/cn, @/ds/icons로 교체.
// 클래스 리매핑: bg-primary-bg(선택 틴트)→bg-accent-bg, text-neutral-darkGray→text-fg-muted.
// border-neutral-darkMiddleGray는 팔레트 직접 클래스(리매핑표 밖)로 무변경.
import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';

interface Props {
  checked: boolean;
}

const IconCheckbox = (props: Props) => {
  return (
    <div className="relative shrink-0 flex items-center justify-center w-4 h-4">
      <div
        className={cn(
          'absolute top-0 left-0 w-full h-full border border-neutral-darkMiddleGray rounded-full',
          props.checked && 'border-primary-light bg-accent-bg',
        )}
      />
      {getAppIcon('CHECK', {
        size: 12,
        colorClass: cn('relative text-fg-muted', props.checked && 'text-primary'),
      })}
    </div>
  );
};

export default IconCheckbox;
