// 원본: TOAST asset/components/common/contents/Badge.tsx
// 변경: cn 임포트를 @/ds/lib/cn으로 교체. React.ReactNode는 원본에 React 임포트가 없어 컴파일 불가 —
// verbatimModuleSyntax 대응으로 'import type { ReactNode }' 명시 임포트로 교체(타입 동일, API 변경 없음).
// 클래스 리매핑: rounded-lgx→rounded-control, h-22px→h-[22px](커스텀 치수 키 폐기, arbitrary로. 원 키 값 22px 그대로).
import type { ReactNode } from 'react';
import { cn } from '@/ds/lib/cn';

interface Props {
  name?: string;
  className?: string; // 글자색, 폰트 스타일, 백그라운드 항상 지정 필요 (폰트 스타일 기본: typo-bold_caption)
  children?: ReactNode;
}

const Badge = ({ name, className, children }: Props) => {
  return (
    <div
      className={cn(
        // leading-none: typo-bold_caption의 line-height는 1.8(=21.6px)이라 h-[22px] 안에
        // 여유가 0.4px뿐이고, 호출부가 border를 얹으면 콘텐츠 박스가 20px가 되어 라인박스가
        // 넘친다. 한 줄짜리 고정 높이 알약에서 line-height는 보이는 것을 바꾸지 않고
        // (수직 정렬은 items-center가 한다) 박스 계산만 망가뜨린다.
        'inline-flex items-center h-[22px] px-2 rounded-control typo-bold_caption leading-none',
        className,
      )}
    >
      {name && <>{name}</>}
      {children && <>{children}</>}
    </div>
  );
};

export default Badge;
