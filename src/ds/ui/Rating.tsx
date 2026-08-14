import { cn } from '@/ds/lib/cn';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const Rating = ({ value, onChange, readOnly = false }: RatingProps) => (
  <div className="flex items-center gap-1" role={readOnly ? 'img' : 'radiogroup'} aria-label={`별점 ${value}점`}>
    {[1, 2, 3, 4, 5].map((level) => (
      <button
        key={level}
        type="button"
        role={readOnly ? undefined : 'radio'}
        aria-checked={readOnly ? undefined : level === value}
        disabled={readOnly}
        onClick={() => onChange?.(level)}
        className={cn('flex size-[18px] items-center justify-center text-[18px] leading-none', level <= value ? 'text-[#f9a80c]' : 'text-[#ebeef1]')}
      >
        ★
      </button>
    ))}
  </div>
);

export default Rating;
