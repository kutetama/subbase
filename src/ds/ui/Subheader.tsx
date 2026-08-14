import type { ReactNode } from 'react';
import { cn } from '@/ds/lib/cn';

interface SubheaderProps {
  title: string;
  action?: ReactNode;
  firstChild?: boolean;
}

const Subheader = ({ title, action, firstChild = false }: SubheaderProps) => (
  <div className={cn('flex h-[55px] w-full items-end justify-between border-t border-[#ebeef1] px-5 pb-2', firstChild && 'h-[54px] border-t-0')}>
    <h3 className="text-base font-semibold leading-[22px] text-fg">{title}</h3>
    {action && <div className="text-sm leading-[18px] text-primary">{action}</div>}
  </div>
);

export default Subheader;
