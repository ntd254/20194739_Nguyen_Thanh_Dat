import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FC, useEffect } from 'react';
import { ExternalLink, Info, Trash2 } from 'lucide-react';
import { useLogInUser } from '@/lib/hooks/use-log-in-user';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLoginStripe } from './hooks/use-login-stripe';
import { useUpdateProfile } from './hooks/use-update-profile';
import DropzoneImage from '@/components/ui/dropzone-image';
import { useUploadAvatar } from './hooks/use-upload-avatar';
import UrlInput from './url-input';
import { Website } from '@/client-sdk';

const profileFormSchema = z.object({
  avatar: z.string().min(1, 'Avatar không được để trống'),
  name: z.string().min(1, 'Tên không được để trống'),
  bio: z.string().min(1, 'Tiểu sử không được để trống'),
  links: z
    .array(
      z.object({
        url: z.string().url('Url không hợp lệ'),
        website: z.nativeEnum(Website),
      }),
    )
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

const AccountFeature: FC = () => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: '', bio: '' },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'links',
    control: form.control,
  });

  const { update, isPending } = useUpdateProfile();
  const onSubmit = (data: ProfileFormValues) => {
    update(data);
  };

  const { user } = useLogInUser();
  const { login, isPending: isPendingLogin } = useLoginStripe();

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        bio: user.bio || undefined,
        links: user.links.map((link) => ({
          url: link.url,
          website: link.website,
        })),
        avatar: user.avatar || undefined,
      });
    }
  }, [user, form]);

  const { upload, value, isSuccess } = useUploadAvatar();
  const onDropImage = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      form.setError('avatar', { message: 'Ảnh không hợp lệ' });
      return;
    }
    upload(acceptedFiles[0]);
  };
  useEffect(() => {
    if (isSuccess && value) {
      form.setValue('avatar', value);
      form.clearErrors('avatar');
    }
  }, [isSuccess, value, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="avatar"
          render={() => (
            <FormItem>
              <FormLabel>Ảnh đại diện</FormLabel>
              <FormControl>
                <DropzoneImage
                  onDrop={onDropImage}
                  onCloseImage={() => form.resetField('avatar')}
                  defaultImageUrl={user?.avatar || undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="Tên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiểu sử</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Giới thiệu về bản thân bạn"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <div className="mb-2">
            <p className="text-sm font-medium leading-none">URLs</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Thêm link tới website, blog, hoặc mạng xã hội của bạn.
            </p>
          </div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`links.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <UrlInput field={field} />
                        <button onClick={() => remove(index)}>
                          <Trash2 />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage path={`links.${index}.url`} />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ url: '', website: Website.FACEBOOK })}
          >
            Thêm URL
          </Button>
        </div>

        {user?.stripeAccount?.detailsSubmitted && (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">Tài khoản Stripe </p>
              <TooltipProvider delayDuration={500}>
                <Tooltip>
                  <TooltipTrigger type="button" className="cursor-default">
                    <Info size={16} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Bạn có thể xem doanh thu, lịch sử giao dịch tại tài khoản
                      Stripe
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              onClick={() => login()}
              variant="link"
              className="h-auto p-0 text-base"
              loading={isPendingLogin}
              type="button"
            >
              {user?.stripeAccount?.accountId} <ExternalLink size={18} />
            </Button>
          </div>
        )}

        <Button type="submit" loading={isPending}>
          Cập nhật hồ sơ
        </Button>
      </form>
    </Form>
  );
};

export default AccountFeature;
