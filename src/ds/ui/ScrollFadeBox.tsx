// TOAST ScrollFadeBox 이식 (스크롤 컨테이너 + 4방향 가장자리 딤 처리).
// 원본: TOAST asset/components/common/contents/scroll-area/ScrollFadeBox.tsx
// 변경: cn 경로 교체, ScrollDimItem 상호참조 경로 교체.
// 원본이 쓰던 @/hooks/useScrollExist(children 변경 시 재계산하는 4방향 훅, deps 인자 받음)는
// 기존 @/ds/hooks/useScrollExist(인자 없음, 좌우 2방향만)와 시그니처가 달라 재사용 불가하고
// 기존 파일 수정도 금지 대상이라, 동일 동작을 이 파일 내부 로컬 훅으로 최소 재구현
// (기존 useScrollExist.ts와 동일한 update/useEffect/ResizeObserver 패턴을 4방향+deps로 확장).
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { cn } from "@/ds/lib/cn";
import ScrollDimItem from "@/ds/ui/ScrollDimItem";

interface Props {
  ref?: RefObject<HTMLDivElement>;
  children: ReactNode;
  direction?: "vertical" | "horizontal";
  className?: string;
  dimColor?: string;
  containerClassName?: string;
  scrollContainerClassName?: string;
}

function useScrollFadeExist(deps: unknown[]) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [topVisible, setTopVisible] = useState(false);
  const [bottomVisible, setBottomVisible] = useState(false);
  const [scrollDir, setScrollDir] = useState({ horizontal: false, vertical: false });

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setLeftVisible(el.scrollLeft > 0);
    setRightVisible(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    setTopVisible(el.scrollTop > 0);
    setBottomVisible(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    setScrollDir({
      horizontal: el.scrollWidth > el.clientWidth,
      vertical: el.scrollHeight > el.clientHeight,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, ...deps]);

  return { scrollRef, leftVisible, rightVisible, topVisible, bottomVisible, scrollDir };
}

const ScrollFadeBox = ({
  ref,
  children,
  direction = "vertical",
  className,
  dimColor = "from-semantic-bg",
  containerClassName,
  scrollContainerClassName,
}: Props) => {
  const { scrollRef, leftVisible, rightVisible, topVisible, bottomVisible, scrollDir } =
    useScrollFadeExist([children]);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {/* horizontal scroll */}
      {direction === "horizontal" && leftVisible && (
        <ScrollDimItem className={`bg-gradient-to-r ${dimColor} left-0 top-0 bottom-0 w-12`} />
      )}
      {direction === "horizontal" && rightVisible && (
        <ScrollDimItem className={`bg-gradient-to-l ${dimColor} right-0 top-0 bottom-0 w-12`} />
      )}

      {/* vertical scroll */}
      {direction === "vertical" && topVisible && (
        <ScrollDimItem
          className={`border-black bg-gradient-to-b ${dimColor} left-0 right-0 top-0 h-12`}
        />
      )}
      {direction === "vertical" && bottomVisible && (
        <ScrollDimItem
          className={`border-black bg-gradient-to-t ${dimColor} left-0 right-0 bottom-0 h-12`}
        />
      )}

      {/* contents */}
      <div
        ref={ref ?? scrollRef}
        className={cn(
          "overflow-auto max-h-full scrollbar-default",
          scrollDir.vertical || scrollDir.horizontal
            ? scrollContainerClassName
            : containerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollFadeBox;
