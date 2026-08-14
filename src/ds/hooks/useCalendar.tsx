// TOAST useCalendar 이식 (Calendar의 열림 상태·범위 제한 로직).
// 원본: TOAST asset/components/common/calendar/useCalendar.tsx
// 변경: showToast(@/utils/toast, 발췌본에 없음)는 최소 재구현 — 기존 설치 의존성 react-toastify의
// toast()를 동일 이름으로 alias import(호출부 무변경). ToastContainer 마운트는 앱 단(App.tsx) 책임이라
// 이 포트 범위 밖.
import { toast as showToast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";

interface Props {
  active: boolean;
  value: DateRange;
  onChange: (value: DateRange) => void;
  maxRange?: number;
}

const useCalendar = ({ value, onChange, maxRange, active: initActive }: Props) => {
  const [active, setActive] = useState(initActive);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // : active to false on click outside of calendar
  useEffect(() => {
    if (!active) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [active]);

  // : on trigger button clicked
  const onTriggerClick = () => {
    setActive((prev) => !prev);
  };

  // : on date select
  const handleSelect = (selected: DateRange) => {
    if (!selected?.from || !selected?.to) {
      onChange(selected);
      return;
    }

    const diffInDays = (selected.to.getTime() - selected.from.getTime()) / (1000 * 60 * 60 * 24);

    if (maxRange && diffInDays > maxRange) {
      const limitedTo = new Date(selected.from);
      limitedTo.setDate(limitedTo.getDate() + maxRange);
      onChange({ from: selected.from, to: limitedTo });
      showToast(`최대 ${maxRange}일까지 선택할 수 있습니다.`);
      return;
    }

    onChange(selected);
  };

  return { value, active, calendarRef, handleSelect, onTriggerClick };
};

export default useCalendar;
