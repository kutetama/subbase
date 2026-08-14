// 원본: TOAST asset/components/common/button/CircleButton.tsx
// 변경: cn/getAppIcon 경로 교체, 커스텀 치수 키 w-100px/h-100px/w-60px/h-60px → arbitrary px.
//       bg-neutral-black·text-white는 팔레트 직결 무변경 (다크모드에서 팔레트 반전으로 자동 대응).
import type { appIcon } from "@/ds/icons";
import { getAppIcon } from "@/ds/icons";
import { cn } from "@/ds/lib/cn";

interface Props {
  name: string;
  appIcon: appIcon;
  iconOnly: boolean;
  onClick: () => void;
}

const CircleButton = ({ name, appIcon, iconOnly, onClick }: Props) => {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-col justify-center items-center gap-1.5 w-[100px] h-[100px] rounded-full bg-neutral-black text-white transition-all", // w-100px h-100px
        iconOnly && "w-[60px] h-[60px]", // w-60px h-60px
      )}
      onClick={onClick}
    >
      {getAppIcon(appIcon)}
      {!iconOnly && <span className="typo-bold_P">{name}</span>}
    </button>
  );
};

export default CircleButton;
