// 원본: TOAST asset/components/common/contents/Switch.tsx
// 변경: cn 임포트를 @/ds/lib/cn으로 교체. 클래스 리매핑: bg-white→bg-surface(on 상태 손잡이 색).
// bg-semantic-lineGray(off 상태)는 표에 없는 클래스라 무변경.
import { cn } from '@/ds/lib/cn';

interface Props {
  on: boolean;
  disabled?: boolean;
  onChange: (bool: boolean) => void;
}

const Switch = ({ on, disabled = false, onChange }: Props) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!on);
      }}
      className={cn(
        'w-[42px] p-[3px] rounded-full transition-colors duration-200',
        on ? 'bg-primary' : 'bg-neutral-lightGray',
        disabled ? 'opacity-50 cursor-default' : 'cursor-pointer',
      )}
    >
      <span
        className={cn(
          'block w-[18px] h-[18px] rounded-full transition-all duration-200',
          on ? 'bg-surface' : 'bg-semantic-lineGray',
        )}
        style={{ transform: `translateX(${on ? 18 : 0}px)` }}
      />
    </button>
  );
};

export default Switch;
