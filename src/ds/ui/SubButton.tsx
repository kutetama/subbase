// 원본: TOAST asset/components/common/button/SubButton.tsx
// 변경: cn/getAppIcon 경로 교체, sizeStyles → @/ds/lib/button-styles(피그마 실측 재구성),
//       text-neutral-darkMiddleGray→text-fg-subtle 리매핑.
import type { appIcon } from "@/ds/icons";
import { getAppIcon } from "@/ds/icons";
import { cn } from "@/ds/lib/cn";
import { type buttonSize, sizeStyles } from "@/ds/lib/button-styles";

interface Props {
  name: string;
  appIcon?: appIcon;
  iconSize?: number;
  iconColorClass?: string;
  size?: buttonSize;
  disabled?: boolean;
  onClick: () => void;
}

const SubButton = (props: Props) => {
  return (
    <button
      type="button"
      className={cn(
        "flex justify-center items-center gap-2 py-1 px-3 typo-bold_smallP text-fg-subtle transition-colors",
        props.size ? sizeStyles[props.size] : sizeStyles["default"],
        "disabled:text-neutral-middleGray",
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

export default SubButton;
