import Link from 'next/link';
import { buttonVariants } from './button';
import { cn } from '@/lib/utils/cn';

export default function NotFound() {
  return (
    <div className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center justify-center">
      <h2 className="text-9xl">404</h2>
      <p className="text-muted-foreground">
        Oops! Trang bạn đang tìm kiếm không tồn tại.
      </p>
      <Link
        className={cn(buttonVariants({ variant: 'default' }), 'mt-3')}
        href="/courses"
      >
        Trở về trang chủ
      </Link>
    </div>
  );
}
