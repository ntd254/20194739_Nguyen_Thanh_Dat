import { FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useLogInUser } from '@/lib/hooks/use-log-in-user';
import { useLogout } from '../header/hooks/use-logout';
import { useCartStore } from '@/lib/hooks/use-cart';
import { cn } from '@/lib/utils/cn';
import Notification from '../header/notification';

const TeacherHeader: FC = () => {
  const { user } = useLogInUser();

  const clearCart = useCartStore((state) => state.clearCart);

  const { logout } = useLogout();

  return (
    <div className="h-[76px]">
      <div className="flex items-center justify-end gap-2 py-3 pr-10">
        <Link
          className={cn(buttonVariants({ variant: 'link' }), 'text-base')}
          href="/courses"
        >
          Học viên
        </Link>

        <Notification />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-[46px] w-[46px] rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <Avatar className="h-[46px] w-[46px]">
                <AvatarImage src={user?.avatar || undefined} alt="avatar" />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                logout(undefined, { onSuccess: () => clearCart() })
              }
            >
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TeacherHeader;
