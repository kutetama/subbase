// 원본: TOAST asset/components/common/input/InputCheckboxOnly.tsx
// 변경: cn/getAppIcon 임포트를 @/ds/lib/cn, @/ds/icons로 교체.
// 클래스 리매핑: before:bg-primary-bg→before:bg-accent-bg(선택 틴트), group-hover:text-neutral-darkMiddleGray→group-hover:text-fg-subtle.
import { useEffect, useState } from 'react';
import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';

interface CallbackProps {
  checked: boolean;
  value: string;
}

interface Props {
  value: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (data: CallbackProps) => void;
}

const InputCheckboxOnly = ({
  value,
  checked: checkedProp,
  disabled: disabledProp = false,
  onChange = () => {},
}: Props) => {
  const [checked, setChecked] = useState<boolean>(checkedProp);
  const disabled = disabledProp;

  useEffect(() => {
    setChecked(checkedProp);
  }, [checkedProp]);

  const handleOnChange = (value: string) => {
    onChange({ checked: !checked, value });
  };

  return (
    <div
      className={cn(
        'group relative shrink-0 flex items-center justify-center w-4 h-4',
        disabled && 'opacity-50',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => handleOnChange(value)}
        aria-label={value}
        className={cn(
          'appearance-none', //기본 스타일 reset
          `before:content-[''] before:block before:absolute before:top-0 before:left-0 before:w-full before:h-full before:border before:border-neutral-middleGray before:rounded-full`,
          'group-hover:before:border-neutral-darkMiddleGray',
          checked &&
            'before:border-primary-light before:bg-accent-bg group-hover:before:border-primary-light',
          disabled && 'group-hover:before:border-neutral-middleGray',
          disabled && checked && 'group-hover:before:border-primary-light',
        )}
      />

      {getAppIcon('CHECK', {
        size: 12,
        colorClass: cn(
          'relative text-neutral-middleGray',
          'group-hover:text-fg-subtle',
          checked && 'text-primary group-hover:text-primary',
          disabled && 'group-hover:text-neutral-middleGray',
          disabled && checked && 'group-hover:text-primary',
        ),
      })}
    </div>
  );
};

export default InputCheckboxOnly;
