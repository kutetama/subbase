import { getAppIcon } from '@/ds/icons';
import { cn } from '@/ds/lib/cn';

interface ChipProps {
  label: string;
  selected?: boolean;
  type?: 'check' | 'option' | 'input';
  disabled?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

const Chip = ({ label, selected = false, type = 'check', disabled = false, onClick, onRemove }: Readonly<ChipProps>) => {
  const className = cn(
    'inline-flex h-9 items-center gap-0.5 rounded-[6px] border px-3 text-sm leading-[18px] transition-colors',
    !selected && 'border-neutral-lightMiddleGray bg-surface text-[#9397a1]',
    selected && type === 'check' && 'border-primary bg-primary-bg pl-2 text-primary',
    selected && type === 'option' && 'border-primary bg-primary text-white',
    type === 'input' && 'border-neutral-lightMiddleGray bg-semantic-bg pr-1 text-fg-muted',
    disabled && 'cursor-not-allowed opacity-50',
  );

  if (type === 'input') {
    return (
      <span className={className}>
        <span>{label}</span>
        <button type="button" disabled={disabled} aria-label={`${label} 제거`} className="ml-2 inline-flex size-7 items-center justify-center rounded-control bg-surface text-[#9397a1]" onClick={onRemove}>
          {getAppIcon('X_MARK', { size: 16 })}
        </button>
      </span>
    );
  }

  return (
    <button type="button" disabled={disabled} aria-pressed={selected} onClick={onClick} className={className}>
      {selected && type === 'check' && getAppIcon('CHECK', { size: 18 })}
      <span>{label}</span>
    </button>
  );
};

export default Chip;
