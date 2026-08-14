// 원본: TOAST asset/components/common/button/XButton.tsx
// 변경: getAppIcon 임포트를 @/ds/icons로 교체. 클래스 리매핑 대상 없음(무변경 클래스만 사용).
import { getAppIcon } from '@/ds/icons';

interface Props {
  onClick: () => void;
  colorClass?: string;
  size?: number;
}

const XButton = ({ onClick, colorClass, size = 24 }: Props) => {
  return (
    <button type="button" className="flex justify-center items-center" onClick={onClick}>
      {getAppIcon('OL_X', { size, colorClass })}
    </button>
  );
};

export default XButton;
