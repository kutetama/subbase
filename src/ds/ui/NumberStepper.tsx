// 원본: TOAST asset/components/common/contents/NumberStepper.tsx
// 변경: cn→@/ds/lib/cn, getAppIcon→@/ds/icons. tailwind-styled-components(tw.button) 의존 제거 →
// 일반 함수 컴포넌트 + cn 클래스 병합으로 전환(1차 웨이브 CompactPagination.tsx의 tw.button 변환과 동일 패턴).
// 클래스 리매핑: border-semantic-lineGray→border-line(값 박스·버튼 공통), rounded-lgx→rounded-control,
// text-neutral-darkMiddleGray→text-fg-subtle(버튼). text-fg(원본 오탈자)은 실제 매칭 클래스가
// 아니라 표 대상이 아니므로 오탈자 그대로 보존. border-semantic-error(조건부)는 표에 없어 무변경.
// span의 text-semantic-error→text-danger는 표 대상이라 교체.
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';

interface Props {
  minNum?: number;
  maxNum?: number;
  value: number;
  width?: string;
  onChange: (value: number) => void;
}

const NumberStepper = ({ minNum = 0, maxNum, value, width, onChange }: Props) => {
  const isInvalidValue = value < minNum || (maxNum !== undefined && value > maxNum);

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-2.5">
        <Button
          type="button"
          onClick={() => {
            const minus = value - 1;
            onChange(Math.max(minus, minNum));
          }}
        >
          {getAppIcon('OL_MINUS_SM', { size: 18 })}
        </Button>
        <div
          className={cn(
            'flex justify-end items-center h-9 py-2 px-4 border border-line rounded-control text-fg typo-regular_smalllP transition-colors',
            isInvalidValue && 'border-semantic-error',
          )}
          style={{ width: width ?? '50px' }}
        >
          {value}
        </div>
        <Button
          type="button"
          onClick={() => {
            const plus = value + 1;
            onChange(maxNum === undefined ? plus : Math.min(plus, maxNum));
          }}
        >
          {getAppIcon('OL_PLUS_SM', { size: 18 })}
        </Button>
      </div>
      {isInvalidValue && <span className="text-danger">최소, 최대값을 확인해주세요</span>}
    </div>
  );
};

export default NumberStepper;

const Button = ({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...rest}
    className={cn(
      'flex justify-center items-center w-8 h-8 border border-line rounded-full text-fg-subtle',
      className,
    )}
  />
);
