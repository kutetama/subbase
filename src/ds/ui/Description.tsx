import type { ReactNode } from 'react';
import { cn } from '@/ds/lib/cn';

interface DescriptionProps {
  children: ReactNode;
  tone?: 'default' | 'subtle';
  className?: string;
}

const Description = ({ children, tone = 'default', className }: DescriptionProps) => (
  <p className={cn('text-sm leading-[22px]', tone === 'default' ? 'text-fg-muted' : 'text-neutral-middleGray', className)}>
    {children}
  </p>
);

export default Description;
