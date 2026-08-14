// 원본: TOAST asset/components/common/contents/ContextMenu.tsx
// 변경: cn 임포트를 @/ds/lib/cn으로 교체. popover.css를 이 파일에서 연결
// (소비 측에서 @radix-ui/react-popover의 Popover.Content 자식으로 ContextMenu를 렌더링하는 것이 원본 사용 패턴 —
// TOAST asset/components/ui/ContextMenus.tsx 데모에서 확인됨).
// 클래스 리매핑: min-w-context_menu→min-w-[150px](커스텀 치수 키 폐기, 원 키 값 150px 그대로),
// rounded-2.5xl→rounded-panel, bg-white→bg-surface, border-semantic-lineGray→border-line,
// text-neutral-black→text-fg. shadow-basic/typo-semiBold_smalllP은 무변경 대상이라 그대로 둠.
import type { PropsWithChildren } from 'react';

import { cn } from '@/ds/lib/cn';
import '@/ds/styles/popover.css';

interface ButtonProps {
  name: string;
  className?: string;
  onClick: () => void;
}

const ContextMenu = (props: PropsWithChildren) => {
  return (
    <div className="flex flex-col min-w-[150px] rounded-panel bg-surface shadow-basic">
      {props.children}
    </div>
  );
};

ContextMenu.Button = function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'py-1 px-3 min-h-9 border-b border-line typo-semiBold_smalllP text-fg last:border-none',
        props.className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick();
      }}
    >
      {props.name}
    </button>
  );
};

export default ContextMenu;
