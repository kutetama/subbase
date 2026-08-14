import { cn } from '@/ds/lib/cn';

interface SpinnerProps {
  label?: string;
}

const Dots = () => (
  <span className="flex items-center gap-1.5" aria-hidden>
    {[0, 1, 2].map((index) => <span key={index} className="size-[5px] animate-pulse rounded-full bg-primary" style={{ animationDelay: `${index * 160}ms` }} />)}
  </span>
);

const Spinner = ({ label }: SpinnerProps) => (
  <div role="status" className={cn('inline-flex items-center justify-center border border-[#ebeef1] bg-surface', label ? 'h-[42px] gap-3 rounded-full px-5' : 'size-[52px] rounded-full')}>
    <Dots />
    {label && <span className="text-sm leading-[22px] text-fg-muted">{label}</span>}
  </div>
);

export default Spinner;
