// TOAST TextEllipsisWithCount 이식 (common-business/text-ellipsis).
// 원본: TOAST asset/components/common-business/text-ellipsis/TextEllipsisWithCount.tsx
// 변경: cn 경로 교체, Tooltip을 ds/ui/Tooltip으로 교체(다른 워커가 동시 이식 중 — 원본 API 보존 가정).
// 클래스 리매핑: text-neutral-darkGray→text-fg-muted. react-ellipsis-component 임포트는 원본 그대로 유지.
import { useState } from 'react';
import Ellipsis from 'react-ellipsis-component';

import { cn } from '@/ds/lib/cn';
import Tooltip from '@/ds/ui/Tooltip';

interface Props {
  /** 뱃지에 표시할 텍스트 */
  text: string;
  /** 선택된 값의 총 개수 (2개 이상일 경우 "+N" 형태로 표시) */
  count?: number;
  /** 툴팁에 표시할 텍스트 (기본: text와 동일) */
  tooltipText?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * - 텍스트 표시
 * - 텍스트가 길 경우 말줄임(...) 처리 및 툴팁 제공
 * - 여러 값이 선택된 경우 "+N" 형태로 추가 개수 표시
 */
const TextEllipsisWithCount = ({
  text,
  count = 1,
  tooltipText = text,
  className = '',
  disabled = false,
}: Props) => {
  const multipleValue = count > 1;
  const [use, setUse] = useState<boolean>(multipleValue);

  return (
    <Tooltip text={tooltipText} use={use} maxWidth="240px">
      <Ellipsis
        text={text}
        ellipsis={true}
        onReflow={(isEllipsis) => {
          if (multipleValue) return;
          setUse(isEllipsis);
        }}
        className={cn(
          'inline-block typo-regular_caption',
          className,
          disabled ? 'text-neutral-middleGray' : 'text-fg-muted',
        )}
      />

      {multipleValue && <span className="ml-0.5 typo-bold_caption text-fg-muted">+{count - 1}</span>}
    </Tooltip>
  );
};

export default TextEllipsisWithCount;
