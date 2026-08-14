// 원본: TOAST asset/components/common/button/LineButton.tsx
// 변경: cn/getAppIcon 경로 교체, sizeStyles → @/ds/lib/button-styles(피그마 실측 재구성),
//       rounded-lgx→rounded-control. 브랜드 표면 클래스(border-primary-light·bg-primary-bg·text-primary)는
//       팔레트 직결이라 무변경 (호버/선택 틴트 용법이 아님).
import type { appIcon } from "@/ds/icons";
import { getAppIcon } from "@/ds/icons";
import { cn } from "@/ds/lib/cn";
import { type buttonSize, sizeStyles } from "@/ds/lib/button-styles";

interface Props {
  name: string;
  size?: buttonSize;
  disabled?: boolean;
  appIcon?: appIcon;
  iconSize?: number;
  iconColorClass?: string;
  onClick: () => void;
}

const LineButton = (props: Props) => {
  return (
    <button
      type="button"
      className={cn(
        "flex justify-center items-center gap-2 py-1 px-3 border border-primary-light bg-primary-bg rounded-control typo-bold_smallP text-primary transition-colors",
        props.size ? sizeStyles[props.size] : sizeStyles["default"],
        "hover:border-primary",
        "disabled:bg-semantic-bg disabled:border-semantic-lineGray disabled:text-neutral-middleGray",
      )}
      disabled={props?.disabled ?? false}
      onClick={props.onClick}
    >
      {props.appIcon && (
        <>
          {getAppIcon(props.appIcon, {
            colorClass: props.iconColorClass,
            size: props.iconSize ?? 21,
          })}
        </>
      )}
      {props.name}
    </button>
  );
};

export default LineButton;
