import { cn } from '@/ds/lib/cn';

export interface ImageListItem {
  id: string;
  title: string;
  description?: string;
  src?: string;
}

interface ImageListProps {
  items: ImageListItem[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const gridStyles = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };

const ImageList = ({ items, columns = 2, className }: ImageListProps) => (
  <div className={cn('grid w-full gap-3.5 bg-surface', gridStyles[columns], className)}>
    {items.map((item) => (
      <article key={item.id} className="min-w-0">
        <div className="aspect-square overflow-hidden rounded-control bg-gradient-to-br from-primary-bg via-[#f2f4f8] to-primary-lightBg">
          {item.src && <img src={item.src} alt="" className="size-full object-cover" />}
        </div>
        <div className="mt-2">
          <h4 className="truncate text-sm leading-5 text-fg">{item.title}</h4>
          {item.description && <p className="truncate text-[13px] leading-[18px] text-neutral-middleGray">{item.description}</p>}
        </div>
      </article>
    ))}
  </div>
);

export default ImageList;
