import type { ReactNode } from 'react';

interface ListItemProps {
  title: string;
  description?: string;
  control?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
}

const ListItem = ({ title, description, control, action, onClick }: ListItemProps) => (
  <div
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    className="flex min-h-[67px] w-full items-center gap-3 border-b border-[#ebeef1] bg-surface px-1 py-4 text-left"
    onClick={onClick}
    onKeyDown={(event) => {
      if (onClick && (event.key === 'Enter' || event.key === ' ')) onClick();
    }}
  >
    {control && <span className="shrink-0">{control}</span>}
    <span className="min-w-0 flex-1">
      <span className="block truncate text-base leading-[26px] text-fg">{title}</span>
      {description && <span className="block truncate text-[13px] leading-[18px] text-neutral-middleGray">{description}</span>}
    </span>
    {action && <span className="shrink-0 text-[#9397a1]">{action}</span>}
  </div>
);

export default ListItem;
