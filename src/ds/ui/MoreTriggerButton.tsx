// 원본: TOAST asset/components/common/button/MoreTriggerButton.tsx
// 변경: getAppIcon 임포트를 @/ds/icons로 교체. text-neutral-middleGray는 팔레트 직접 클래스로 무변경.
import React from 'react';
import { getAppIcon } from '@/ds/icons';

type Props = {
  iconSize?: number;
  iconColorClass?: string;
} & React.ComponentProps<'button'>;

// NOTE: popover trigger에 사용하는 버튼
const MoreTriggerButton = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      onClick, // popover onClick 핸들러
      // icon properties
      iconSize,
      iconColorClass,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        type="button"
        className="flex justify-center items-center text-neutral-middleGray"
        {...rest}
      >
        {getAppIcon('OL_DOTS_VERTICAL', { size: iconSize ?? 21, colorClass: iconColorClass })}
      </button>
    );
  },
);

export default MoreTriggerButton;
