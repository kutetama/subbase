// TOAST DataTableToolbar 이식 (선택 행 액션 툴바).
// 원본: TOAST asset/components/common/contents/table/DataTableToolbar.tsx
// 변경: getAppIcon 경로 교체. TextButton(../../button/TextButton)은 포트 목록 밖 미존재 의존이라
// 최소 재구현 — size prop 없이 name/onClick만 지원하는 로컬 ToolbarActionButton으로 대체
// (원본 호출부가 항상 size="fit"만 사용하므로 폭 제약 없는 형태로 대체).
// 클래스 리매핑: rounded-2.5xl→rounded-panel.
import type { ReactElement } from "react";
import { getAppIcon } from "@/ds/icons";

interface ActionButtonProps {
  name: string;
  onClick: () => void;
}

interface Props {
  selectedLength: number;
  actionButtons?: ActionButtonProps[];
  children?: ReactElement;
  onReset: () => void;
}

const DataTableToolbar = (props: Props) => {
  return (
    <div className="px-5 py-2 rounded-panel bg-[rgba(255,255,255,0.85)]">
      <div className="inline-flex items-center gap-2">
        <span className="typo-semiBold_smalllP text-primary">{props.selectedLength}개 선택됨</span>
        <button type="button" onClick={props.onReset}>
          {getAppIcon("OL_X_CIRCLE", { size: 23, colorClass: "text-primary-dark" })}
        </button>
      </div>
      {props.actionButtons && (
        <div className="inline-flex gap-2 ml-4">
          {props.actionButtons.map((el) => (
            <ToolbarActionButton key={el.name} name={el.name} onClick={el.onClick} />
          ))}
        </div>
      )}
      {props.children}
    </div>
  );
};

export default DataTableToolbar;

const ToolbarActionButton = ({ name, onClick }: ActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex justify-center items-center gap-2 py-1 px-3 border border-line rounded-control typo-semiBold_smalllP text-fg bg-transparent transition-colors hover:bg-semantic-bg"
  >
    {name}
  </button>
);
