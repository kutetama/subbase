// TOAST useFetchStatusGate 이식 (common-business/fetch-state).
// 원본: TOAST asset/components/common-business/fetch-state/useFetchStatusGate.ts
// 변경: FetchStatusGateProps 임포트 경로를 ds/biz/FetchStatusGate로 교체 (컴포넌트·훅 디렉터리 분리에 따름).
import { useRef, useEffect } from 'react';

import type { FetchStatusGateProps } from '@/ds/biz/FetchStatusGate';

const useFetchStatusGate = ({ loading, visibleContent }: FetchStatusGateProps) => {
  const isDirtyRef = useRef<boolean>(false);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);

    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, []);

  useEffect(() => {
    if (visibleContent) {
      if (loading) isDirtyRef.current = true;
      else isDirtyRef.current = false;
    }
  }, [loading]);
};

export default useFetchStatusGate;
