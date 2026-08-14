import type { ReactNode } from 'react';
import { getAppIcon } from '@/ds/icons';
import { cn } from '@/ds/lib/cn';

interface AppBarProps {
  title?: string;
  navigation?: boolean;
  action?: ReactNode;
  scrolled?: boolean;
  onBack?: () => void;
}

const AppBar = ({ title, navigation = true, action, scrolled = false, onBack }: AppBarProps) => (
  <header
    className={cn(
      'flex h-14 w-full items-center justify-between bg-surface px-2 transition-shadow',
      !navigation && 'pl-5',
      scrolled && 'shadow-[0_2px_8px_rgba(34,34,34,0.08)]',
    )}
  >
    <div className="flex min-w-0 items-center">
      {navigation && (
        <button type="button" aria-label="뒤로" className="flex size-10 items-center justify-center text-fg" onClick={onBack}>
          {getAppIcon('CHEVRON_LEFT', { size: 24 })}
        </button>
      )}
      {title && <h2 className="truncate text-lg font-normal leading-6 text-fg">{title}</h2>}
    </div>
    {action && <div className="flex h-10 items-center">{action}</div>}
  </header>
);

export default AppBar;
