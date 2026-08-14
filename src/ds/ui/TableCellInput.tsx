// 원본: TOAST asset/components/common/input/TableCellInput.tsx
// 변경: cn 임포트를 @/ds/lib/cn으로 교체.
// 클래스 리매핑: text-neutral-darkGray→text-fg-muted.
import { cn } from '@/ds/lib/cn';
import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  typo?: 'semibold';
}

const TableCellInput = (props: Props) => {
  return (
    <input
      {...props}
      className={cn(
        'w-full bg-transparent text-fg-muted',
        props.typo === 'semibold' && 'typo-semiBold_smalllP',
      )}
    />
  );
};

export default TableCellInput;
