// 원본: TOAST asset/components/common/contents/pagination/Pagination.tsx
// 변경: cn/getAppIcon 임포트를 @/ds/lib/cn, @/ds/icons로, usePagination을 @/ds/hooks/usePagination으로 교체.
// tailwind-styled-components(tw.button) 의존 제거 → 일반 함수 컴포넌트 + cn 클래스 병합으로 전환(클래스 문자열 보존).
// 클래스 리매핑: border-semantic-lineGray→border-line, rounded-2.5xl→rounded-panel, bg-white→bg-surface,
// text-neutral-black→text-fg, text-neutral-darkGray→text-fg-muted.
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/ds/lib/cn';
import { getAppIcon } from '@/ds/icons';

import usePagination from '@/ds/hooks/usePagination';

export interface Props {
  small?: true;
  currentPage: number;
  totalPage: number;
  pageRange?: number; //기본 10개
  activeBgClassName?: string;
  onPageChange: (page: number) => void;
}

const ICON_SIZE = 18;

const Pagination = (props: Props) => {
  const { pageGroup, pages, inputPage, onInputChange } = usePagination(props);

  return (
    <div
      className={cn(
        'relative flex items-center min-h-8 gap-2',
        props.small ? 'justify-between' : 'justify-end',
      )}
    >
      <div className={cn('flex gap-1', !props.small && 'absolute left-1/2 -translate-x-1/2')}>
        {props.totalPage > 5 && (
          <Button
            type="button"
            disabled={props.currentPage === 1}
            onClick={() => props.onPageChange(1)}
            aria-label="처음으로"
          >
            {getAppIcon('CHEVRON_DOUBLE_LEFT', { size: ICON_SIZE })}
          </Button>
        )}
        <Button
          type="button"
          disabled={props.currentPage === 1}
          onClick={() => props.onPageChange(props.currentPage - 1)}
          aria-label="이전"
        >
          {getAppIcon('CHEVRON_LEFT', { size: ICON_SIZE })}
        </Button>
        {pageGroup.length &&
          pageGroup.map((page) => {
            if (pages.length > 0) {
              return (
                <Button
                  key={`pagination_${page}`}
                  type="button"
                  className={cn(
                    props.currentPage === page &&
                      (props.activeBgClassName ? `${props.activeBgClassName}` : ACTIVE_CLASS),
                  )}
                  onClick={() => props.onPageChange(page)}
                >
                  {page}
                </Button>
              );
            }
          })}
        <Button
          type="button"
          disabled={props.currentPage === props.totalPage}
          onClick={() => props.onPageChange(props.currentPage + 1)}
          aria-label="다음"
        >
          {getAppIcon('CHEVRON_RIGHT', { size: ICON_SIZE })}
        </Button>
        {props.totalPage > 5 && (
          <Button
            type="button"
            className=""
            disabled={props.currentPage === props.totalPage}
            onClick={() => props.onPageChange(props.totalPage)}
            aria-label="마지막으로"
          >
            {getAppIcon('CHEVRON_DOUBLE_RIGHT', { size: ICON_SIZE })}
          </Button>
        )}
      </div>
      <div>
        <span className="typo-regular_overline text-fg-muted">Page</span>

        <input
          value={inputPage}
          onChange={onInputChange}
          className="min-h-8 ml-2.5 px-3.5 w-12 text-center rounded-panel bg-surface typo-bold_caption text-fg"
          type="text"
          placeholder={`${props.currentPage ?? ''}`}
          onBlur={(e) => {
            e.target.value = props.currentPage.toString();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = Number((e.target as HTMLInputElement).value);
              if (!Number.isNaN(value)) {
                let page = value;
                if (value < 1) {
                  page = 1;
                } else if (value > props.totalPage) {
                  page = props.totalPage;
                }
                props.onPageChange(page);
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Pagination;

const Button = ({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...rest}
    className={cn(
      'flex justify-center items-center w-8 h-8 rounded-full border border-line typo-regular_overline text-neutral-middleGray',
      'disabled:cursor-default disabled:border-neutral-lightGray disabled:text-neutral-lightMiddleGray',
      className,
    )}
  />
);

const ACTIVE_CLASS = 'bg-neutral-black border-neutral-black text-white';
