// 원본: TOAST asset/components/common/contents/Tooltip.tsx
// 변경: cn 임포트를 @/ds/lib/cn으로 교체. react-tooltip.css를 이 파일에서 연결(실제 전역
// <Tooltip id="app-tooltip" className="app-react-tooltip"> 싱글턴 마운트는 앱 루트 소관이라 포트 범위 밖).
// React.ReactNode(원본에 React 임포트 없음)는 verbatimModuleSyntax 대응으로 'import type { ReactNode }'
// 명시 임포트로 교체(1차 웨이브 Badge.tsx와 동일 패턴). 클래스 리매핑 대상 없음(inline-block/cursor-*는 무변경).
import type { ReactNode } from 'react';
import type { PlacesType } from 'react-tooltip';

import { cn } from '@/ds/lib/cn';
import '@/ds/styles/react-tooltip.css';

interface Props {
  text: string;
  useHtml?: boolean;
  /** 조건 부로 툴팁을 사용하고 싶은 경우 사용*/
  use?: boolean;
  /** CSS maxWidth 값 (예: '180px', '80%')
   * - html을 사용하지 않는 경우 maxWidth 사용가능
   * - html을 사용하는 경우 maxWidth 사용불가 (style 직접 입력)
   * @example
   * <Tooltip
      text={'html을 사용하지 않는 경우'}
      maxWidth='180px'
    >...</Tooltip>

    <Tooltip
      text={`<p style="max-width: 180px">html을 사용하는 경우</p>`}
      useHtml
    >...</Tooltip>
   */
  maxWidth?: string;
  place?: PlacesType;
  cursorPointer?: boolean;
  children: ReactNode;
}

const Tooltip = ({ text, useHtml, use = true, maxWidth, place, cursorPointer, children }: Props) => {
  const appTooltipAttr = () => {
    return {
      'data-tooltip-id': 'app-tooltip',
      ...(useHtml ? { 'data-tooltip-html': text } : { 'data-tooltip-content': text }),
      ...(maxWidth && { 'data-tooltip-max-width': maxWidth }),
      ...(place && { 'data-tooltip-place': place }),
    };
  };

  return (
    <div
      {...(use && text !== '' && appTooltipAttr())}
      className={cn('inline-block', cursorPointer ? 'cursor-pointer' : 'cursor-default')}
    >
      {children}
    </div>
  );
};

export default Tooltip;
