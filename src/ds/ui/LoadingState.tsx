// TOAST LoadingState 이식 (인라인 로딩 인디케이터).
// 원본: TOAST asset/components/common/contents/state/LoadingState.tsx
// 변경 없음 — ldrs/react 그대로 유지, 리매핑 대상 클래스 없음(text-primary는 팔레트 직접 클래스).
// states.tsx(NotiState/ErrorState)는 수정 금지 대상이라 이 컴포넌트는 별도 파일로 유지.
import { Hourglass } from "ldrs/react";
import "ldrs/react/Hourglass.css";

const LoadingState = () => {
  return (
    <div className="text-primary">
      <Hourglass size="34" bgOpacity="0.1" speed="1.75" color="currentColor" />
    </div>
  );
};

export default LoadingState;
