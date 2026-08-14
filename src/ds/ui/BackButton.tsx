// 원본: TOAST asset/components/common/button/BackButton.tsx
// 변경: getAppIcon 임포트를 @/ds/icons로 교체. 클래스 리매핑 대상 없음(무변경 클래스만 사용).
import { getAppIcon } from '@/ds/icons';

interface Props {
  onClick: () => void;
}

const BackButton = (props: Props) => {
  return (
    <button type="button" className="flex justify-center items-center" onClick={props.onClick}>
      {getAppIcon('OL_CHEVRON_LEFT')}
    </button>
  );
};

export default BackButton;
