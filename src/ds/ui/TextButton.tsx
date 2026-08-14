// 원본: TOAST asset/components/common/button/TextButton.tsx
// 변경: cn/getAppIcon 경로 교체, sizeStyles → @/ds/lib/button-styles(피그마 실측 재구성),
//       border-semantic-lineGray→border-line, rounded-lgx→rounded-control,
//       오타 클래스 text-nuetral-black(제품의 죽은 클래스)→text-fg 수정.
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
  className?: string;
}

const TextButton = (props: Props) => {
  return (
    <button
      type="button"
      className={cn(
        "flex justify-center items-center gap-2 py-1 px-3 border border-line rounded-control typo-semiBold_smalllP text-fg bg-transparent transition-colors",
        props.size ? sizeStyles[props.size] : sizeStyles["default"],
        "hover:bg-semantic-bg",
        "disabled:bg-transparent disabled:text-neutral-middleGray",
        props.className,
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

export default TextButton;
