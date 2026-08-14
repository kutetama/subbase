import { getAppIcon } from '@/ds/icons';
import { cn } from '@/ds/lib/cn';

interface SectionMessageProps {
  message: string;
  type?: 'normal' | 'error' | 'ghost';
  onAction?: () => void;
}

const SectionMessage = ({ message, type = 'normal', onAction }: SectionMessageProps) => (
  <div
    className={cn(
      'flex min-h-[46px] w-full items-center rounded-[6px] border pl-4',
      type === 'normal' && 'border-[#ebeef1] bg-semantic-bg text-[#9397a1]',
      type === 'error' && 'border-[#ee4700] bg-surface text-[#ee4700]',
      type === 'ghost' && 'border-[#ebeef1] bg-surface text-neutral-middleGray',
    )}
  >
    <span className="flex min-w-0 flex-1 items-center gap-1.5 text-sm leading-[22px]">
      {type === 'normal' && getAppIcon('OL_SHIELD_CHECK', { size: 14 })}
      {type === 'error' && getAppIcon('OL_EXCLAMATION_CIRCLE', { size: 14 })}
      <span className="truncate">{message}</span>
    </span>
    {onAction && (
      <button type="button" aria-label="자세히" className="flex size-9 items-center justify-center" onClick={onAction}>
        {getAppIcon('CHEVRON_RIGHT', { size: 20 })}
      </button>
    )}
  </div>
);

export default SectionMessage;
