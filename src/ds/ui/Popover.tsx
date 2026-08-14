// Toastfy 범용 Popover — radix(@radix-ui/react-popover) 래퍼 (2026-08-11 신규 작성).
// 제품에는 radix 직사용 패턴(_popover.scss z-index 규칙)과 콘텐츠 컴포넌트(ContextMenu)만 있고
// 트리거+포지셔닝을 갖춘 범용 컴포넌트가 없어 신설. SelectBox·Filter·SearchBox의 내부 radix 사용과 동일 계열.
// 스타일: 서피스·라인·rounded-panel·shadow-basic — ContextMenu 컨테이너와 동일 톤 (다크·프리셋 자동 추종).
// 사용:
//   <Popover trigger={<MoreTriggerButton />}> …콘텐츠 (ContextMenu 조합 권장)… </Popover>
// 주의: trigger는 ref를 전달받는 요소여야 한다 (forwardRef 컴포넌트 또는 일반 DOM 요소 —
//       MoreTriggerButton은 forwardRef라 바로 사용 가능).
import * as RadixPopover from "@radix-ui/react-popover";
import type { ReactNode } from "react";
import { cn } from "@/ds/lib/cn";
import "@/ds/styles/popover.css";

interface Props {
  /** 클릭 시 팝오버를 여는 트리거 요소 (ref 전달 가능해야 함) */
  trigger: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  /** 제어형으로 쓸 때만 지정 (기본은 비제어) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 콘텐츠 컨테이너 클래스 — 패딩·폭 등 (기본 스킨은 유지하고 cn으로 병합됨) */
  contentClassName?: string;
}

const Popover = ({
  trigger,
  children,
  side = "bottom",
  align = "start",
  sideOffset = 6,
  open,
  onOpenChange,
  contentClassName,
}: Props) => {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-[9999] overflow-hidden rounded-panel border border-line bg-surface shadow-basic focus:outline-none",
            contentClassName,
          )}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export default Popover;

/** 닫기 트리거 — 콘텐츠 내부 버튼에 asChild로 감싸 사용 */
export const PopoverClose = RadixPopover.Close;
