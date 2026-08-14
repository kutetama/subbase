// 원본: TOAST asset/components/common/input/InputPassword.tsx
// 변경: cn/getAppIcon 임포트를 @/ds/lib/cn, @/ds/icons로 교체.
// 클래스 리매핑: border-semantic-lineGray→border-line, rounded-lgx→rounded-control, hover:bg-primary-bg→hover:bg-accent-bg,
// text-semantic-error→text-danger.
import React, { useState } from 'react';
import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';

interface Props {
  placeholder: string;
  disabled?: boolean;
  invalidText?: string;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
}

const InputPassword = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const [value, setValue] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div>
      <div className="relative">
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          value={value}
          placeholder={props.placeholder}
          disabled={props?.disabled ?? false}
          onChange={(e) => {
            setValue(e.target.value);
            if (props.onChange) {
              props.onChange(e.target.value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && props.onEnter) {
              props.onEnter(value);
            }
          }}
          className={cn(
            'w-full h-9 py-2 px-4 border border-line rounded-control text-fg typo-regular_smalllP transition-colors appearance-none [&::-ms-reveal]:hidden [&::-ms-clear]:hidden',
            'hover:bg-accent-bg hover:text-fg-muted',
            'focus:border-primary-light',
            'disabled:bg-semantic-bg disabled:text-neutral-middleGray',
            props?.invalidText && 'pr-9 border-semantic-error',
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute top-1/2 right-3 -translate-y-1/2"
          >
            {visible ? (
              <>{getAppIcon('OL_EYE', { size: 20, colorClass: 'text-neutral-middleGray' })}</>
            ) : (
              <>{getAppIcon('OL_EYE_OFF', { size: 20, colorClass: 'text-neutral-middleGray' })}</>
            )}
          </button>
        )}
      </div>

      {props?.invalidText && (
        <div className="ml-3.5 typo-regular_caption text-danger">{props.invalidText}</div>
      )}
    </div>
  );
});

export default InputPassword;
