// 원본: TOAST asset/components/common/input/InputRadio.tsx
// 변경: cn 임포트를 @/ds/lib/cn으로 교체. '@/types/common'의 IdNameProps 부재로 파일 내 최소 재구현.
// 클래스 리매핑: text-neutral-black→text-fg.
import { useEffect, useState } from 'react';
import { cn } from '@/ds/lib/cn';

// '@/types/common'의 IdNameProps 부재로 인한 최소 재구현 (사용부 계약 기반: id/name 쌍)
interface IdNameProps {
  id: string;
  name: string;
}

interface Props {
  valuePair: IdNameProps;
  checked: boolean;
  disabled: boolean;
  onChange: (el: IdNameProps) => void;
}

const InputRadio = (props: Props) => {
  const [checked, setChecked] = useState<boolean>(props.checked);
  const disabled = props.disabled;

  useEffect(() => {
    setChecked(props.checked);
  }, [props.checked]);

  const handleOnChange = (el: IdNameProps) => {
    props.onChange(el);
  };

  return (
    <label
      className={cn(
        'group flex gap-3 min-h-6 px-0.5 cursor-pointer',
        disabled && 'opacity-50 cursor-default',
      )}
    >
      <input
        type="radio"
        checked={checked}
        disabled={disabled}
        onChange={() => handleOnChange(props.valuePair)}
        className={cn(
          'appearance-none', //기본 스타일 reset
          'relative shrink-0 flex items-center justify-center w-4 h-4 mt-1 cursor-pointer',
          `before:content-[''] before:block before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-full before:bg-neutral-lightMiddleGray`,
          `after:content-[''] after:block after:relative after:w-1/2 after:h-1/2 after:rounded-full after:bg-semantic-lineGray`,
          'group-hover:before:bg-semantic-lineGray group-hover:after:bg-neutral-middleGray',
          checked &&
            'before:bg-primary-light after:bg-primary group-hover:before:bg-primary-light group-hover:after:bg-primary',
          disabled &&
            'cursor-default group-hover:before:bg-neutral-lightMiddleGray group-hover:after:bg-semantic-lineGray',
          disabled &&
            checked &&
            'cursor-default group-hover:before:bg-primary-light group-hover:after:bg-primary',
        )}
      />
      <span
        className={cn(
          'text-fg select-none cursor-pointer',
          disabled && 'cursor-default',
        )}
      >
        {props.valuePair.name}
      </span>
    </label>
  );
};

export default InputRadio;
