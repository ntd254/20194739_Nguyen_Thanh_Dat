import Image from 'next/image';
import Logo from '../../../../../public/images/logo.svg';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { pageList } from '@/constants/page-list';
import { useSignUp } from './hooks/use-sign-up';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { setNewToken } from '@/lib/utils/set-new-token';
import { LoginResponseDto } from '@/client-sdk';
import { useLoginGoogle } from '../../log-in/hooks/use-login-google';

export const signUpSchema = z
  .object({
    email: z.string().min(1, 'Chưa nhập email').email('Email không hợp lệ'),
    password: z.string().min(1, 'Chưa nhập mật khẩu'),
    confirmPassword: z.string().min(1, 'Chưa nhập mật khẩu xác nhận'),
    name: z.string().min(1, 'Chưa nhập tên'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpFeature() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  });

  const router = useRouter();
  const redirect = router.query.redirect as string | undefined;

  const { signUp, isPending } = useSignUp();
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onSubmit = (values: SignUpFormValues) =>
    signUp(
      { formValues: values, redirect },
      { onSuccess: () => setSignUpSuccess(true) },
    );

  useEffect(() => {
    const broadCastChannel = new BroadcastChannel('sign-up');
    broadCastChannel.onmessage = (message) => {
      if (message.data === 'success') {
        window.location.href = `${window.location.origin}/courses`;
      }
    };

    return () => {
      broadCastChannel.close();
    };
  }, []);

  const queryClient = useQueryClient();
  const handleLoginSuccess = (data: LoginResponseDto) => {
    setNewToken(data.accessToken, data.refreshToken);
    queryClient.invalidateQueries({ queryKey: ['getMe'] });
    router.push(redirect ?? '/courses');
  };
  const { loginGoogle } = useLoginGoogle();

  if (signUpSuccess) {
    return (
      <div className="container mx-auto space-y-6 pt-20 sm:w-[350px] lg:px-0">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image src={Logo} alt="logo" />

          <h1 className="text-2xl font-bold">Kiểm tra tài khoản của bạn</h1>
          <p className="text-sm text-muted-foreground">
            Chúng tôi vừa link xác nhận email tới {form.getValues('email')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 pt-20 sm:w-[350px] lg:px-0">
      <div className="flex flex-col items-center space-y-2 text-center">
        <Image src={Logo} alt="logo" />

        <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>
        <Link
          className={buttonVariants({
            variant: 'link',
            className: 'flex gap-1.5',
          })}
          href={pageList.logIn}
        >
          Đã có tài khoản ? <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1 py-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input {...field} placeholder="you@example.com" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1 py-2">
                <FormLabel htmlFor="name">Tên</FormLabel>
                <Input {...field} placeholder="Name" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1 py-2">
                <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                <Input {...field} type="password" placeholder="Password" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1 py-2">
                <FormLabel htmlFor="confirmPassword">
                  Xác nhận mật khẩu
                </FormLabel>
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm password"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" loading={isPending}>
            Đăng ký
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative text-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
      >
        <GoogleLogin
          size="medium"
          width={350}
          onSuccess={(credentialResponse) => {
            loginGoogle(credentialResponse.credential!, {
              onSuccess: handleLoginSuccess,
            });
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
}
