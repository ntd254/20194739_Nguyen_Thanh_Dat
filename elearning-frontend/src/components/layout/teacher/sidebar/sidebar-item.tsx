import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

type Props = {
  href: string;
  text: string;
  active: boolean;
  icon: ReactNode;
  expanded: boolean;
};

const SidebarItem: FC<Props> = ({ active, href, icon, text, expanded }) => {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          'group relative flex cursor-pointer items-center whitespace-nowrap rounded-md p-3 font-medium transition-colors hover:bg-muted',
          active && 'bg-secondary text-primary',
        )}
      >
        {icon}
        <span
          className={cn(
            'h-0 w-0 overflow-hidden transition-all',
            expanded && 'ml-3 h-max w-72',
          )}
        >
          {text}
        </span>

        {!expanded && (
          <div className="invisible absolute left-full top-1/2 ml-5 w-max -translate-x-3 -translate-y-1/2 rounded-md bg-muted px-2 py-1 text-sm font-medium opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100">
            {text}
          </div>
        )}
      </Link>
    </li>
  );
};

export default SidebarItem;
