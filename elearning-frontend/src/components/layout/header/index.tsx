import Image from 'next/image';
import Logo from '../../../../public/images/logo.svg';
import Link from 'next/link';
import { Button, buttonVariants } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { cn } from '@/lib/utils/cn';
import { useLogInUser } from '@/lib/hooks/use-log-in-user';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { pageList } from '@/constants/page-list';
import Cart from './cart-button';
import SearchBox from './search-box';
import { useCartStore } from '@/lib/hooks/use-cart';
import { useLogout } from './hooks/use-logout';
import { useLoggedIn } from '@/lib/hooks/use-logged-in';
import { useFirstRender } from '@/lib/hooks/use-first-render';
import MyLearning from './my-learning';
import Notification from './notification';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  const { user } = useLogInUser();

  const isLoggedIn = useLoggedIn();

  const clearCart = useCartStore((state) => state.clearCart);

  const { logout } = useLogout();

  // To avoid layout shift when already logged in
  const { firstRender } = useFirstRender();
  if (firstRender) {
    return null;
  }

  return (
    <div className="border-b">
      <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between p-3">
        <Link href="/courses">
          <Image className="w-44" src={Logo} alt="logo" />
        </Link>

        <div>
          <Link
            className={cn(buttonVariants({ variant: 'link' }), 'text-base')}
            href={pageList.courses.root}
          >
            Khóa học
          </Link>
          {/* Use button to prevent prefetching */}
          <Button
            variant="link"
            className="text-base"
            onClick={() => router.push('/instructor/courses')}
          >
            Giảng viên
          </Button>
        </div>

        <SearchBox />

        <div className="flex items-center gap-3">
          {isLoggedIn && <MyLearning />}

          <Cart />

          {user && isLoggedIn && (
            <>
              <Notification />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-[46px] w-[46px] rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <Avatar className="h-[46px] w-[46px]">
                      <AvatarImage
                        src={user.avatar || undefined}
                        alt="avatar"
                      />
                      <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
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
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link
                href={pageList.logIn}
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'text-base',
                )}
              >
                Đăng nhập
              </Link>
              <Link
                href={pageList.signUp.root}
                className={cn(
                  buttonVariants({ variant: 'secondary' }),
                  'text-base',
                )}
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
