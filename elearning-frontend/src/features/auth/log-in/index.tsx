import Image from 'next/image';
import Logo from '../../../../public/images/logo.svg';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
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
import { useNormalLogin } from './hooks/use-normal-login';
import { useRouter } from 'next/router';
import { useLoginGoogle } from './hooks/use-login-google';
import { LoginResponseDto } from '@/client-sdk';
import { useQueryClient } from '@tanstack/react-query';
import { setNewToken } from '@/lib/utils/set-new-token';

export const logInSchema = z.object({
  email: z.string().min(1, 'Chưa nhập email').email('Email không hợp lệ'),
  password: z.string().min(1, 'Chưa nhập mật khẩu'),
});

export type LogInFormValues = z.infer<typeof logInSchema>;

export default function LogInFeature() {
  const form = useForm<LogInFormValues>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();
  const redirect = router.query.redirect as string | undefined;
  const queryClient = useQueryClient();
  const handleLoginSuccess = (data: LoginResponseDto) => {
    setNewToken(data.accessToken, data.refreshToken);
    queryClient.invalidateQueries({ queryKey: ['getMe'] });
    router.push(redirect ?? '/courses', undefined, {
      unstable_skipClientCache: true,
    });
  };

  const { normalLogin, isPending } = useNormalLogin();
  const { loginGoogle } = useLoginGoogle();

  const onSubmit = (values: LogInFormValues) =>
    normalLogin(values, { onSuccess: handleLoginSuccess });

  return (
    <div className="container mx-auto space-y-6 pt-20 sm:w-[350px] lg:px-0 ">
      <div className="flex flex-col items-center space-y-2 text-center">
        <Image src={Logo} alt="logo" />

        <h1 className="text-2xl font-bold">Đăng nhập tài khoản</h1>
        <Button
          variant="link"
          className="flex gap-1.5"
          onClick={() => {
            if (redirect) {
              router.push({ pathname: '/sign-up', query: { redirect } });
              return;
            }
            router.push('/sign-up');
          }}
        >
          Chưa có tài khoản ? <ArrowRight className="h-4 w-4" />
        </Button>
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
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1 py-2">
                <FormLabel htmlFor="email">Mật khẩu</FormLabel>
                <Input {...field} type="password" placeholder="password" />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vui lòng đợi...
              </>
            ) : (
              'Đăng nhập'
            )}
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
