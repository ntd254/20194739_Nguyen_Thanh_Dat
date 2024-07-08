import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import LessonFormField from './lesson-form-field';
import { Trash2 } from 'lucide-react';
import { useCreateContent } from './hooks/use-create-content';

type Props = {
  onNextStep: () => void;
  onPrevStep: () => void;
  courseId: string;
};

const courseContentSchema = z.object({
  courseId: z.string(),
  sections: z
    .array(
      z.object({
        title: z.string().min(1, 'Chưa nhập tiêu đề'),
        lessons: z
          .array(
            z
              .object({
                title: z.string().min(1, 'Chưa nhập tiêu đề'),
                videoId: z.string().min(1, 'Chưa chọn video').optional(),
                duration: z.number().optional(),
                questions: z
                  .array(
                    z.object({
                      content: z.string().min(1, 'Chưa nhập câu hỏi'),
                      explain: z
                        .string()
                        .min(1, 'Chưa nhập giải thích')
                        .optional(),
                      answers: z
                        .array(
                          z.object({
                            content: z.string().min(1, 'Chưa nhập câu trả lời'),
                            isCorrect: z.boolean().default(false),
                          }),
                        )
                        .min(1, 'Chưa thêm câu trả lời'),
                    }),
                  )
                  .min(1, 'Chưa thêm câu hỏi')
                  .optional(),
              })
              .refine((data) => data.videoId || data.questions, {
                message: 'Chưa thêm nội dung bài học',
              }),
          )
          .nonempty('Chưa thêm bài học'),
      }),
    )
    .nonempty('Khóa học không có nội dung'),
});

export type CourseContentFormValues = z.infer<typeof courseContentSchema>;

export default function CourseContent({ onNextStep, courseId }: Props) {
  const form = useForm<CourseContentFormValues>({
    defaultValues: {
      courseId,
      sections: [{ title: '', lessons: [{ title: '' }] }],
    },
    resolver: zodResolver(courseContentSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: 'sections',
    control: form.control,
  });

  const { createContent } = useCreateContent();

  const onSubmit = (values: CourseContentFormValues) => {
    createContent(
      {
        data: values,
      },
      { onSuccess: onNextStep },
    );
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold">Nội dung khóa học</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-3 flex flex-col"
        >
          <div className="space-y-3">
            {fields.map((fieldArray, index) => (
              <div
                className="rounded-md border border-zinc-500 p-3"
                key={fieldArray.id}
              >
                <p className="group/section flex items-center py-2 font-semibold">
                  Phần {index + 1}{' '}
                  <span
                    className="ml-auto hidden cursor-pointer text-base group-hover/section:block"
                    onClick={() => fields.length > 1 && remove(index)}
                  >
                    <Trash2 />
                  </span>
                </p>
                <FormField
                  name={`sections.${index}.title` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <LessonFormField control={form.control} sectionIndex={index} />
                <div
                  className="absolute right-3 top-3 hidden cursor-pointer text-base"
                  onClick={() => remove(index)}
                >
                  <Trash2 />
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            className="mt-3 self-start"
            onClick={() => append({ title: '', lessons: [{ title: '' }] })}
          >
            Thêm phần
          </Button>
          <div className="ml-auto space-x-2">
            <Button>Tiếp tục</Button>
            {/* <Button onClick={onPrevStep} variant="secondary">
              Quay lại
            </Button> */}
          </div>
        </form>
      </Form>
    </div>
  );
}
