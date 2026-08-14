// 원본: TOAST asset/components/common/button/SolidButton.tsx
// 변경: cn/getAppIcon 경로 교체, buttonSize·sizeStyles → @/ds/lib/button-styles(피그마 실측 재구성),
//       rounded-lgx→rounded-control. 팔레트 직접 클래스(bg-primary·bg-neutral-black 등)는 무변경.
import type { appIcon } from "@/ds/icons";
import { getAppIcon } from "@/ds/icons";
import { cn } from "@/ds/lib/cn";
import { type buttonSize, sizeStyles } from "@/ds/lib/button-styles";

type buttonDesign = "solid" | "solid2";

interface Props {
  name: string;
  size?: buttonSize;
  design?: buttonDesign;
  disabled?: boolean;
  appIcon?: appIcon;
  iconSize?: number;
  iconColorClass?: string;
  onClick: () => void;
}

const baseStyles: Record<buttonDesign, string> = {
  solid: "bg-primary",
  solid2: "bg-neutral-black",
};

const hoverStyles: Record<buttonDesign, string> = {
  solid: "hover:bg-primary-dark",
  solid2: "hover:bg-neutral-darkGray",
};

const disabledStyles: Record<buttonDesign, string> = {
  solid: "disabled:border-semantic-lineGray disabled:bg-semantic-bg",
  solid2: "disabled:border-semantic-lineGray disabled:bg-neutral-lightMiddleGray",
};

const SolidButton = (props: Props) => {
  return (
    <button
      type="button"
      className={cn(
        "flex justify-center items-center gap-2 py-1 px-3 rounded-control typo-bold_smallP text-white transition-colors",
        "disabled:border-neutral-darkMiddleGray disabled:text-neutral-darkGray",
        props.size ? sizeStyles[props.size] : sizeStyles["default"],
        props.design ? baseStyles[props.design] : baseStyles["solid"],
        props.design ? hoverStyles[props.design] : hoverStyles["solid"],
        "disabled:border disabled:text-neutral-middleGray",
        props.design ? disabledStyles[props.design] : disabledStyles["solid"],
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

export default SolidButton;
