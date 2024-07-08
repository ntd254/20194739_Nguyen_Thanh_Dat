import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLogInUser } from '@/lib/hooks/use-log-in-user';

const createCommentSchema = z.object({ content: z.string().min(1) });
export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;

type Props = {
  onSubmit: (
    data: CreateCommentFormValues,
    form: UseFormReturn<CreateCommentFormValues>,
  ) => void;
};

const FormComment: FC<Props> = ({ onSubmit }) => {
  const form = useForm<CreateCommentFormValues>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: '' },
  });

  const { user } = useLogInUser();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit((data) => onSubmit(data, form))}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex items-start gap-2 space-y-0">
              <FormLabel>
                <Avatar>
                  <AvatarImage src={user?.avatar || undefined} />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Viết bình luận"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default FormComment;
