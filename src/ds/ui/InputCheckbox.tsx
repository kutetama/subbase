// 원본: TOAST asset/components/common/input/InputCheckbox.tsx
// 변경: cn/getAppIcon 임포트를 @/ds/lib/cn, @/ds/icons로 교체. '@/types/common'의 IdNameProps 부재로 파일 내 최소 재구현.
// 클래스 리매핑: before:bg-primary-bg→before:bg-accent-bg(선택 틴트), group-hover:text-neutral-darkMiddleGray→group-hover:text-fg-subtle,
// text-neutral-black→text-fg.
import { useEffect, useState } from 'react';
import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';

// '@/types/common'의 IdNameProps 부재로 인한 최소 재구현 (사용부 계약 기반: id/name 쌍)
interface IdNameProps {
  id: string;
  name: string;
}

interface CallbackProps {
  checked: boolean;
  el: IdNameProps;
}

interface Props {
  valuePair: IdNameProps;
  checked: boolean;
  disabled: boolean;
  onChange: (data: CallbackProps) => void;
}

const InputCheckbox = (props: Props) => {
  const [checked, setChecked] = useState<boolean>(props.checked);
  const [disabled, setDisabled] = useState<boolean>(props.disabled);

  useEffect(() => {
    setChecked(props.checked);
  }, [props.checked]);

  useEffect(() => {
    setDisabled(props.disabled);
  }, [props.disabled]);

  const handleOnChange = (el: IdNameProps) => {
    props.onChange({ checked: !checked, el });
  };

  return (
    <label
      className={cn(
        'group flex gap-3 min-h-6 px-0.5 cursor-pointer',
        disabled && 'opacity-50 cursor-default',
      )}
    >
      <div className="relative shrink-0 flex items-center justify-center w-4 h-4 mt-1 cursor-default">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={() => handleOnChange(props.valuePair)}
          className={cn(
            'appearance-none', //기본 스타일 reset
            'cursor-pointer',
            `before:content-[''] before:block before:absolute before:top-0 before:left-0 before:w-full before:h-full before:border before:border-neutral-middleGray before:rounded-full`,
            'group-hover:before:border-neutral-darkMiddleGray',
            checked &&
              'before:border-primary-light before:bg-accent-bg group-hover:before:border-primary-light',
            disabled && 'cursor-default group-hover:before:border-neutral-middleGray',
            disabled && checked && 'cursor-default group-hover:before:border-primary-light',
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
      <span
        className={cn(
          'text-fg select-none cursor-pointer break-all',
          disabled && 'cursor-default',
        )}
      >
        {props.valuePair.name}
      </span>
    </label>
  );
};

export default InputCheckbox;
