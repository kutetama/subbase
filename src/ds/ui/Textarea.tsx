// 원본: TOAST asset/components/common/input/Textarea.tsx
// 변경: cn 임포트를 @/ds/lib/cn으로 교체. '@/utils/merge-refs' 부재로 mergeRefs를 파일 내 최소 재구현.
// 클래스 리매핑: border-semantic-lineGray→border-line, bg-white→bg-surface, hover:bg-primary-bg→hover:bg-accent-bg,
// placeholder:text-neutral-darkMiddleGray→placeholder:text-fg-subtle, text-semantic-error→text-danger.
import React, {
  useRef,
  useEffect,
  useState,
  type TextareaHTMLAttributes,
  type Ref,
  type RefCallback,
  type MutableRefObject,
} from 'react';

import { cn } from '@/ds/lib/cn';

// '@/utils/merge-refs' 부재로 인한 최소 재구현 — 콜백/객체 ref 여러 개를 하나의 콜백으로 병합
function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = node;
      }
    });
  };
}

interface Props extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  initialValue?: string;
  height?: string;
  allowNewline?: boolean;
  placeholder?: string;
  maxLength?: number;
  invalidText?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      initialValue: initialValueProp,
      height: heightProp,
      allowNewline: allowNewlineProp = true,
      placeholder: placeholderProp,
      maxLength: maxLengthProp,
      invalidText: invalidTextProp,
      disabled: disabledProp,
      onChange: onChangeProp,
      onEnter: onEnterProp,
      ...rest
    },
    ref,
  ) => {
    const domRef = useRef<HTMLTextAreaElement>(null);
    const [init, setInit] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => {
      if (!init && initialValueProp) {
        setInit(true);
        setValue(initialValueProp);
      }
    }, [initialValueProp, init]);

    useEffect(() => {
      if (rest.value) {
        setValue(rest.value.toString());
      }
    }, [rest.value]);

    return (
      <div>
        <div
          style={{ height: heightProp || '130px' }}
          className={cn(
            'relative w-full py-2.5 px-4 pr-1.5 border border-line rounded-lg bg-surface',
            'hover:bg-accent-bg',
            focus && 'border-primary-light',
            disabledProp && 'bg-semantic-bg hover:bg-semantic-bg',
            invalidTextProp && 'border-semantic-error',
          )}
        >
          <textarea
            ref={mergeRefs(domRef, ref)}
            value={value}
            placeholder={placeholderProp}
            maxLength={maxLengthProp}
            disabled={disabledProp}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!allowNewlineProp) {
                  e.preventDefault();
                }
                if (onEnterProp) {
                  onEnterProp(value);
                }
              }
            }}
            onChange={(e) => {
              setValue(e.target.value);
              if (onChangeProp) {
                onChangeProp(e.target.value);
              }
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className={cn(
              'scrollbar-default !overflow-y-scroll w-full h-full pr-1.5 typo-regular_smalllP outline-none resize-none',
              'placeholder:text-fg-subtle bg-transparent',
              'disabled:text-neutral-middleGray',
            )}
            {...rest}
          />
          {maxLengthProp && (
            <p className="absolute bottom-2.5 right-3 typo-regular_overline text-neutral-middleGray">
              {`${value.length}자 / ${maxLengthProp}자`}
            </p>
          )}
        </div>
        {invalidTextProp && (
          <p className="ml-3.5 typo-regular_caption text-danger">{invalidTextProp}</p>
        )}
      </div>
    );
  },
);

export default Textarea;
