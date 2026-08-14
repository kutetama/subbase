import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import '@/ds/styles/daypicker.css';
import { cn } from '@/ds/lib/cn';

interface DatePickerProps {
  value?: Date;
  defaultMonth?: Date;
  onChange: (date?: Date) => void;
  className?: string;
}

const DatePicker = ({ value, defaultMonth, onChange, className }: DatePickerProps) => (
  <div className={cn('inline-block w-[328px] rounded-control border border-neutral-lightMiddleGray bg-surface p-3 shadow-shadow1', className)}>
    <DayPicker mode="single" selected={value} defaultMonth={defaultMonth} onSelect={onChange} />
  </div>
);

export default DatePicker;
