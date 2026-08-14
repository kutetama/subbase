// TOAST ScrollDimItem 이식 (스크롤 가장자리 그라데이션 딤 처리 아이템).
// 원본: TOAST asset/components/common/contents/scroll-area/ScrollDimItem.tsx
// 변경: cn 경로 교체.
import { cn } from "@/ds/lib/cn";

const ScrollDimItem = ({ className }: { className?: string }) => {
  return (
    <div className={cn("to-transparent absolute z-10 pointer-events-none select-none", className)} />
  );
};

export default ScrollDimItem;
