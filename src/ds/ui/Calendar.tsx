// TOAST Calendar 이식 (react-day-picker v9 래퍼).
// 원본: TOAST asset/components/common/calendar/Calendar.tsx
// 변경: cn 경로 교체, useCalendar를 @/ds/hooks로 교체, daypicker.css 연결.
// 클래스 리매핑: bg-white→bg-surface, rounded-lgx→rounded-control.
import { DayPicker, type DateRange } from "react-day-picker";
import type { ReactNode } from "react";
import { cn } from "@/ds/lib/cn";
import useCalendar from "@/ds/hooks/useCalendar";
import "react-day-picker/style.css"; // v9 베이스 스타일 (원본 scss의 @use 대체 — 미로드 시 그리드 언스타일드)
import "@/ds/styles/daypicker.css";

interface Props {
  className?: string;
  value: DateRange;
  onChange: (value: DateRange) => void;
  maxRange?: number;
  children?: ReactNode;
}

const Calendar = ({ className, value, onChange, maxRange, children }: Props) => {
  const { handleSelect, active, onTriggerClick, calendarRef } = useCalendar({
    value,
    onChange,
    maxRange,
    active: !children,
  });

  const renderCalendar = () => {
    return (
      <div
        ref={calendarRef}
        className={cn(
          "absolute bg-surface px-4 pt-2 pb-4 rounded-control w-[680px] z-10",
          className,
          active ? "block" : "hidden",
        )}
      >
        <DayPicker
          mode="range"
          numberOfMonths={2}
          selected={value}
          onSelect={handleSelect}
          required
        />
      </div>
    );
  };

  if (children) {
    return (
      <div className="flex">
        <button type="button" onClick={onTriggerClick}>
          {children}
        </button>
        {renderCalendar()}
      </div>
    );
  } else {
    return renderCalendar();
  }
};

export default Calendar;
