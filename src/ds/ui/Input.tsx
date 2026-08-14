// 원본: TOAST asset/components/common/input/Input.tsx
// 변경: cn/getAppIcon 임포트를 @/ds/lib/cn, @/ds/icons로 교체.
// 클래스 리매핑: border-semantic-lineGray→border-line, rounded-lgx→rounded-control, hover:bg-primary-bg→hover:bg-accent-bg,
// text-neutral-darkMiddleGray→text-fg-subtle, text-semantic-error→text-danger. Props API 변경 없음(noUnusedLocals 대응으로
// 렌더부의 props.X 참조를 이미 구조분해된 동일 변수 참조로 정리 — 동작 동일).
import React, { useEffect, useState, type InputHTMLAttributes } from 'react';
import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> {
  initialValue?: string;
  search?: true;
  triggerOnEnter?: true;
  placeholder: string;
  disabled?: boolean;
  invalidText?: string;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => boolean | void;
  onBlur?: (value: string) => boolean | void;
  value?: string;
  inputClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    initialValue,
    value: incomingValue,
    invalidText,
    placeholder,
    onChange,
    triggerOnEnter,
    onEnter,
    onBlur,
    inputClassName,
    search,
    ...rest
  } = props;
  const [init, setInit] = useState<boolean>(false);
  const [value, setValue] = useState<string>(incomingValue ?? '');

  useEffect(() => {
    if (!init && initialValue) {
      setInit(true);
      setValue(initialValue);
    }
  }, [initialValue, init]);

  useEffect(() => {
    if (incomingValue != undefined) {
      setValue(incomingValue);
    }
  }, [incomingValue]);

  return (
    <div>
      <div className="relative">
        {search && (
          <>
            <div className="absolute top-1/2 left-4 -translate-y-1/2">
              {getAppIcon('OL_SEARCH', {
                size: 16,
                colorClass: 'text-fg-subtle',
              })}
            </div>
            <div className="absolute top-full left-3.5 typo-regular_caption text-danger">
              {invalidText}
            </div>
          </>
        )}

        <input
          {...rest}
          ref={ref}
          type={rest.type ?? 'text'}
          value={value}
          placeholder={placeholder}
          disabled={props?.disabled ?? false}
          onChange={(e) => {
            if (!triggerOnEnter && onChange) {
              onChange(e.target.value);
            }
            setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (triggerOnEnter && onChange && e.key === 'Enter') {
              onChange(value);
            } else if (e.key === 'Enter' && onEnter) {
              const shouldReset = onEnter(value);
              if (shouldReset === false) {
                setValue(incomingValue ?? ''); // 원래 값으로 복구
              }
            }

            rest.onKeyDown?.(e);
          }}
          onBlur={() => {
            if (onBlur) {
              const shouldReset = onBlur(value);
              if (shouldReset === false) {
                setValue(incomingValue ?? ''); // 원래 값으로 복구
              }
            }
          }}
          className={cn(
            'w-full h-9 py-2 px-4 border border-line rounded-control text-fg typo-regular_smalllP transition-colors',
            'hover:bg-accent-bg hover:text-fg-muted',
            'focus:border-primary-light',
            'disabled:bg-semantic-bg disabled:text-neutral-middleGray',
            search && 'pl-9',
            invalidText && 'pr-9 border-semantic-error',
            inputClassName,
          )}
        />
        {invalidText && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {getAppIcon('EXCLAMATION_CIRCLE', { size: 16, colorClass: 'text-danger' })}
          </div>
        )}
      </div>

      {invalidText && (
        <div className="ml-3.5 typo-regular_caption text-danger">{invalidText}</div>
      )}
    </div>
  );
});

export default Input;
