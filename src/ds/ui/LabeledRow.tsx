// TOAST LabeledRow 이식 (라벨+콘텐츠 가로 행).
// 원본: TOAST asset/components/common/contents/labeled-section/LabeledRow.tsx
// 변경: 클래스 리매핑만 (border-semantic-lineGray→border-line). 로직/문자열 조합은 원본 그대로
// (getBorderStyle의 " + border-*" 접두는 원본 그대로 유지 — 원본 자체 버그로 보이나 포트 범위 밖).
import type { ReactNode } from "react";

interface Props {
  label?: string;
  children?: ReactNode;
  className?: string;
  labelWidth?: number;
  border?: {
    left?: boolean;
    right?: boolean;
    top?: boolean;
    bottom?: boolean;
  };
}

const LabeledRow = ({ className, label, children, border, labelWidth = 65 }: Props) => {
  const getBorderStyle = () => {
    let result = "";
    if (border?.bottom) {
      result = `${result} + border-b`;
    }
    if (border?.top) {
      result = `${result} + border-t`;
    }
    if (border?.right) {
      result = `${result} + border-r`;
    }
    if (border?.left) {
      result = `${result} + border-l`;
    }
    return result;
  };
  return (
    <div
      className={`${getBorderStyle()} border-line flex items-center py-[15px] px-5 ${className}`}
    >
      {label && (
        <p style={{ width: labelWidth }} className="grow-0 shrink-0">
          {label}
        </p>
      )}
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default LabeledRow;
