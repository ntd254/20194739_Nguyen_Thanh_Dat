import Image from 'next/image';
import Link from 'next/link';
import { FC, ReactElement, useState } from 'react';
import Logo from '../../../../../public/images/logo.svg';
import {
  ChevronFirst,
  ChevronLast,
  CircleUserRound,
  // LayoutDashboard,
} from 'lucide-react';
import SidebarItem from './sidebar-item';
import { MdOutlineOndemandVideo } from 'react-icons/md';
import { cn } from '@/lib/utils/cn';
import { useRouter } from 'next/router';

const tabs: { href: string; text: string; icon: ReactElement }[] = [
  // {
  //   text: 'Thống kê',
  //   href: '/instructor/dashboard',
  //   icon: <LayoutDashboard size={20} />,
  // },
  {
    text: 'Khóa học',
    href: '/instructor/courses',
    icon: <MdOutlineOndemandVideo className="text-xl" />,
  },
  {
    text: 'Thông tin hồ sơ',
    href: '/instructor/account',
    icon: <CircleUserRound size={20} />,
  },
];

const Sidebar: FC = () => {
  const [expanded, setExpanded] = useState(true);
  const activeTab = useRouter().asPath;

  return (
    <aside>
      <nav className="flex h-full flex-col border-r shadow-sm">
        <div className="mb-2 flex h-[76px] items-center justify-between border-b p-4 pb-2">
          <Link href={'/instructor/courses'}>
            <Image
              className={cn(
                'w-0 overflow-hidden transition-all',
                expanded && 'w-36',
              )}
              src={Logo}
              alt="logo"
            />
          </Link>
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg bg-gray-50 p-1.5 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <ul className="flex-1 space-y-2 px-3">
          {tabs.map((tab) => (
            <SidebarItem
              key={tab.href}
              href={tab.href}
              text={tab.text}
              icon={tab.icon}
              active={activeTab.startsWith(tab.href)}
              expanded={expanded}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
