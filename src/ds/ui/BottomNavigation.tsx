import type { appIcon } from '@/ds/icons';
import { getAppIcon } from '@/ds/icons';
import { cn } from '@/ds/lib/cn';

export interface BottomNavigationItem {
  id: string;
  label: string;
  icon: appIcon;
}

interface BottomNavigationProps {
  items: BottomNavigationItem[];
  activeId: string;
  onChange: (id: string) => void;
}

const BottomNavigation = ({ items, activeId, onChange }: BottomNavigationProps) => (
  <nav className="flex h-[58px] w-[360px] items-stretch border-t border-[#ebeef1] bg-surface px-1.5 pb-[3px]" aria-label="하단 탐색">
    {items.map((item) => {
      const active = item.id === activeId;
      return (
        <button
          key={item.id}
          type="button"
          aria-current={active ? 'page' : undefined}
          className={cn('flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] leading-4', active ? 'text-primary' : 'text-[#9397a1]')}
          onClick={() => onChange(item.id)}
        >
          {getAppIcon(item.icon, { size: 22 })}
          <span>{item.label}</span>
        </button>
      );
    })}
  </nav>
);

export default BottomNavigation;
