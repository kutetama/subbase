// 원본: TOAST asset/components/common/contents/CompactPagination.tsx
// 변경: getAppIcon 임포트를 @/ds/icons로 교체. tailwind-styled-components(tw.button) 의존 제거 →
// 일반 함수 컴포넌트 + cn(@/ds/lib/cn, 신규 사용) 클래스 병합으로 전환(클래스 문자열 보존).
// 클래스 리매핑: border-semantic-lineGray→border-line, text-neutral-black→text-fg, text-neutral-darkMiddleGray→text-fg-subtle.
import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';

interface Props {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  /** 표시 전용 — 내부 이벤트 없이 외부에서 주입된 currentPage만 보여준다 */
  readOnly?: boolean;
}

const ICON_SIZE = 18;

// 두 모드의 박스 크기를 동일하게 유지 — readOnly는 테두리 색만 투명으로 바꾼다
const PAGE_BOX =
  'w-10 h-[34px] px-1 rounded-[10px] border bg-transparent typo-bold_caption text-fg';

/**
 * 콤팩트 페이지네이션
 * - 이전 · {현재}/{총} · 다음
 * - 현재 페이지는 input으로 직접 입력해 이동 가능
 * - `readOnly`면 앞/뒤 버튼과 입력이 모두 막히고 currentPage 표시만 한다
 */
const CompactPagination = ({ currentPage, totalPage, onPageChange, readOnly = false }: Props) => {
  const [inputValue, setInputValue] = useState<string>(String(currentPage));

  useEffect(() => {
    setInputValue(String(currentPage));
  }, [currentPage]);

  const updateValue = () => {
    const num = Number(inputValue);
    if (!Number.isNaN(num) && num >= 1 && num <= totalPage) {
      if (num !== currentPage) onPageChange(num);
    } else {
      setInputValue(String(currentPage)); // 범위 밖/빈 값이면 원복
    }
  };

  const isFirst = readOnly || currentPage <= 1;
  const isLast = readOnly || currentPage >= totalPage;

  return (
    <div className="flex justify-center items-center gap-1 w-full">
      <Button
        type="button"
        disabled={isFirst}
        onClick={() => !isFirst && onPageChange(currentPage - 1)}
        aria-label="이전"
      >
        {getAppIcon('CHEVRON_LEFT', { size: ICON_SIZE })}
      </Button>

      <div className="flex items-center gap-1 typo-bold_caption text-fg">
        {readOnly ? (
          <span className={`${PAGE_BOX} flex justify-center items-center border-transparent`}>
            {currentPage}
          </span>
        ) : (
          <input
            className={`${PAGE_BOX} text-center border-line outline-none`}
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateValue();
                (e.target as HTMLInputElement).blur();
              }
            }}
            onBlur={updateValue}
          />
        )}
        <span className="text-fg-subtle">/ {totalPage}</span>
      </div>

      <Button
        type="button"
        disabled={isLast}
        onClick={() => !isLast && onPageChange(currentPage + 1)}
        aria-label="다음"
      >
        {getAppIcon('CHEVRON_RIGHT', { size: ICON_SIZE })}
      </Button>
    </div>
  );
};

export default CompactPagination;

const Button = ({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...rest}
    className={cn(
      'flex justify-center items-center w-8 h-8 rounded-full border border-line typo-regular_overline text-neutral-middleGray',
      'disabled:cursor-default disabled:opacity-40',
      className,
    )}
  />
);
