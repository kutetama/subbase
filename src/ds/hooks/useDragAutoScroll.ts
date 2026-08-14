// TOAST useDragAutoScroll 이식 (common-business/drag-drop-table).
// 원본: TOAST asset/components/common-business/drag-drop-table/useDragAutoScroll.ts
// 변경 없음 — 외부 의존이 react·react-dnd뿐이라 로직 그대로 이식.
import { useCallback, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';

/** 오토스크롤이 시작되는 컨테이너 상·하단 여백 (px) */
const EDGE_SIZE = 40;
/** 가장자리에 가장 가까울 때의 프레임당 스크롤 양 (px) */
const MAX_SPEED = 12;

/**
 * 드래그 중 스크롤 컨테이너 오토스크롤
 * - `react-dnd-html5-backend`는 오토스크롤을 제공하지 않아 직접 구현한다
 * - 컨테이너 자체를 드롭 타깃으로 잡아 포인터 y를 기록한다 (마지막 행 아래 빈 영역까지 커버)
 *
 * @param dragType 감시할 drag type (`DragDropDataTable` 인스턴스별 고유값)
 */
const useDragAutoScroll = (dragType: string) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerYRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: dragType,
    hover: (_item, monitor) => {
      pointerYRef.current = monitor.getClientOffset()?.y ?? null;
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  // 컨테이너를 벗어나면 hover가 멈춰 마지막 포인터 값이 남으므로, 벗어난 동안은 스크롤하지 않는다
  const isOverRef = useRef<boolean>(false);
  isOverRef.current = isOver;

  const stopAutoScroll = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    pointerYRef.current = null;
  }, []);

  const startAutoScroll = useCallback(() => {
    if (frameRef.current !== null) return;

    const step = () => {
      const container = containerRef.current;
      const pointerY = pointerYRef.current;

      if (container && isOverRef.current && pointerY !== null) {
        const rect = container.getBoundingClientRect();
        const topGap = pointerY - rect.top;
        const bottomGap = rect.bottom - pointerY;

        // 가장자리에 가까울수록 빠르게 (스크롤이 없는 테이블은 scrollTop이 변하지 않아 자연히 무동작)
        if (topGap < EDGE_SIZE) {
          container.scrollTop -= Math.ceil(
            ((EDGE_SIZE - Math.max(topGap, 0)) / EDGE_SIZE) * MAX_SPEED,
          );
        } else if (bottomGap < EDGE_SIZE) {
          container.scrollTop += Math.ceil(
            ((EDGE_SIZE - Math.max(bottomGap, 0)) / EDGE_SIZE) * MAX_SPEED,
          );
        }
      }

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => stopAutoScroll, [stopAutoScroll]);

  /** 컨테이너 ref와 drop 커넥터를 하나로 합친 콜백 ref (`DataTable.bodyScrollRef`로 전달) */
  const bodyScrollRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      drop(node);
    },
    [drop],
  );

  return { bodyScrollRef, startAutoScroll, stopAutoScroll };
};

export default useDragAutoScroll;
