import { cn } from '@/ds/lib/cn';

interface DividerProps {
  direction?: 'horizontal' | 'vertical';
  subtle?: boolean;
  className?: string;
}

const Divider = ({ direction = 'horizontal', subtle = false, className }: DividerProps) => (
  <div
    role="separator"
    aria-orientation={direction}
    className={cn(direction === 'horizontal' ? 'h-px w-full' : 'h-2.5 w-px', subtle ? 'bg-[#ebeef1]' : 'bg-neutral-lightMiddleGray', className)}
  />
);

export default Divider;
