// TOAST FetchStatusGate 이식 (common-business/fetch-state).
// 원본: TOAST asset/components/common-business/fetch-state/FetchStatusGate.tsx
// 변경: cn 경로 교체, ErrorState·NotiState를 ds/ui/states로, LoadingState를 ds/ui/LoadingState로 교체
// (병렬 이식 중 중복 정의됐던 것을 통합 시 단일화), useFetchStatusGate를 ds/hooks로 분리.
import type { PropsWithChildren, ReactNode } from 'react';

import { cn } from '@/ds/lib/cn';
import { ErrorState, NotiState } from '@/ds/ui/states';
import LoadingState from '@/ds/ui/LoadingState';
import useFetchStatusGate from '@/ds/hooks/useFetchStatusGate';

export interface FetchStatusGateProps {
  loading: boolean;
  /** 로딩 중 컨텐츠 표시 여부 (+새로고침 시 confirm)
   * -VisibleStateWrapper 적용: absolute를 이용하여 relative 부모 영역 오버레이
   * -새로고침 시 beforeunload 이벤트 발생
   */
  visibleContent?: boolean;
  error?: boolean;
  errorMessage?: string;
  noti?: boolean;
  notiMessage?: string | string[];
  retryCallback?: () => void;
  /** state를 표시할 wrapper 레이아웃
   * -true: 고정 height (h-52)
   * -false: 유동 height (h-full)
   */
  fixedWrapper?: boolean;
  children?: ReactNode;
}

const StateWrapper = ({ children, fixed }: Readonly<PropsWithChildren & { fixed: boolean }>) => (
  <div
    className={cn(
      'col-span-3 flex items-center justify-center w-full',
      fixed ? 'h-52' : 'h-full',
    )}
  >
    {children}
  </div>
);

const VisibleStateWrapper = ({ children }: Readonly<PropsWithChildren>) => (
  <div className="absolute top-0 right-0 bottom-0 left-0 z-10 flex justify-center items-center">
    <div className="absolute w-full h-full opacity-50 bg-surface" />
    {children}
  </div>
);

const FetchStatusGate = ({
  loading,
  visibleContent = false,
  error,
  errorMessage = '데이터를 가져오지 못했습니다',
  noti,
  notiMessage = '저장된 데이터가 없습니다',
  retryCallback,
  fixedWrapper = true,
  children,
}: FetchStatusGateProps) => {
  useFetchStatusGate({ loading, visibleContent });

  if (visibleContent) {
    return (
      <>
        {loading && (
          <VisibleStateWrapper>
            <LoadingState />
          </VisibleStateWrapper>
        )}
        {children}
      </>
    );
  }

  if (loading) {
    return (
      <StateWrapper fixed={fixedWrapper}>
        <LoadingState />
      </StateWrapper>
    );
  } else if (error) {
    return (
      <StateWrapper fixed={fixedWrapper}>
        <ErrorState message={errorMessage} retryLabel="새로고침" retryCallback={retryCallback} />
      </StateWrapper>
    );
  } else if (noti) {
    return (
      <StateWrapper fixed={fixedWrapper}>
        <NotiState message={notiMessage} />
      </StateWrapper>
    );
  } else {
    return children;
  }
};

export default FetchStatusGate;
