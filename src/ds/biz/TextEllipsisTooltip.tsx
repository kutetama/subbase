// TOAST TextEllipsisTooltip 이식 (common-business/text-ellipsis).
// 원본: TOAST asset/components/common-business/text-ellipsis/TextEllipsisTooltip.tsx
// 변경: cn 경로 교체, Tooltip을 ds/ui/Tooltip으로 교체(다른 워커가 동시 이식 중 — 원본 API 보존 가정).
// react-ellipsis-component 임포트는 원본 그대로 유지.
import { useState } from 'react';
import Ellipsis from 'react-ellipsis-component';
import type { JsEllipsisProps } from 'react-ellipsis-component/dist/type';

import { cn } from '@/ds/lib/cn';
import Tooltip from '@/ds/ui/Tooltip';

type omitJsEllipsisProps = Omit<JsEllipsisProps, 'text' | 'ellipsis' | 'onReflow'>;
interface Props {
  text: string;
  /** 툴팁 항상 사용 여부
   *
   * 기본: 말줄임이 된 경우 툴팁이 자동으로 사용됨
   */
  useTooltip?: boolean;
  tooltipText?: string;
  /** 스타일 지정
   * -width, max-width: 말줄임(ellipsis) 될 너비
   * -text 관련 스타일
   * */
  className?: string;
  /** CSS maxWidth 값 사용 (예: '180px', '80%') */
  tooltipMaxWidth?: string;
  ellipsisProps?: omitJsEllipsisProps;
}

const TextEllipsisTooltip = ({
  text,
  useTooltip = false,
  tooltipText = text,
  className = '',
  tooltipMaxWidth,
  ellipsisProps = {},
}: Props & omitJsEllipsisProps) => {
  const [use, setUse] = useState<boolean>(useTooltip);

  return (
    <Tooltip text={tooltipText} use={use} maxWidth={tooltipMaxWidth}>
      <Ellipsis
        {...ellipsisProps}
        text={text}
        ellipsis={true}
        onReflow={(isEllipsis) => {
          if (useTooltip) return;
          setUse(isEllipsis);
        }}
        className={cn('inline-block', className)}
      />
    </Tooltip>
  );
};

export default TextEllipsisTooltip;
