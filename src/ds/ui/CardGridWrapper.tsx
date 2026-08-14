// TOAST CardGridWrapper 이식 (카드 그리드 반응형 래퍼).
// 원본: TOAST asset/components/common/contents/CardGridWrapper.tsx
// 변경 없음 — 리매핑 대상 클래스 없음. 주의: tablet/tablet-sm 커스텀 브레이크포인트는 현재 타깃
// 프로젝트 토큰(design-system/rootage, generated/tokens.css)에 정의돼 있지 않아 미확인 상태 —
// 브레이크포인트 정의는 index.css/tokens 영역이라 이 포트 범위 밖.
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const CardGridWrapper = (props: Props) => {
  return (
    <div className={props.className}>
      <div className="grid gap-5 grid-cols-4 tablet:grid-cols-3 tablet-sm:grid-cols-2">
        {props.children}
      </div>
    </div>
  );
};

export default CardGridWrapper;
