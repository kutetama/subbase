// TOAST useScrollExist 재구현 — 원본이 발췌본에 없어 DataTable 사용부 계약으로 복원.
// 가로 스크롤 컨테이너의 좌/우 잘림 여부를 반환한다 (Dim 그라데이션 표시용).
import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollExist() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setLeftVisible(el.scrollLeft > 0);
    setRightVisible(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
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
  }, [update]);

  return { scrollRef, leftVisible, rightVisible };
}
