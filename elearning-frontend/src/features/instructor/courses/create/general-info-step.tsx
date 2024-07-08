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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUploadThumbnail } from './hooks/use-upload-thumbnail';
import { useEffect } from 'react';
import { useCreateCourse } from './hooks/use-create-course';
import { useToast } from '@/components/ui/use-toast';
import { Department } from '@/client-sdk';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { departments } from '@/constants/department';
import DropzoneImage from '@/components/ui/dropzone-image';

type GeneralInfoStepProps = {
  onNextStep: () => void;
  onPrevStep: () => void;
  onChangeCourseId: (id: string) => void;
};

const generalInfoSchema = z.object({
  title: z
    .string({ required_error: 'Chưa nhập tiêu đề' })
    .min(1, 'Chưa nhập tiêu đề'),
  thumbnail: z
    .string({ required_error: 'Chưa chọn ảnh đại diện' })
    .min(1, 'Chưa chọn ảnh đại diện'),
  description: z
    .string({ required_error: 'Chưa nhập mô tả' })
    .min(1, 'Chưa nhập mô tả'),
  department: z.nativeEnum(Department, {
    required_error: 'Chưa nhập thể loại',
  }),
  price: z.preprocess(
    (val) => {
      if (!val) {
        return undefined;
      }

      if (val === '') {
        return undefined;
      }
      return Number(val);
    },
    z.number({ required_error: 'Chưa nhập giá' }).min(0, 'Giá không hợp lệ'),
  ),
});

type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>;

export default function GeneralInfoStep({
  onNextStep,
  onChangeCourseId,
}: GeneralInfoStepProps) {
  const { toast } = useToast();

  const form = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema),
  });

  const onDropImage = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      form.setError('thumbnail', { message: 'Ảnh không hợp lệ' });
      return;
    }
    uploadThumbnail({
      thumbnail: acceptedFiles[0],
      handleError: () =>
        toast({
          variant: 'destructive',
          title: 'Upload thumbnail không thành công, vui lòng thử lại',
        }),
    });
  };

  const { uploadThumbnail, key, isSuccess } = useUploadThumbnail();
  useEffect(() => {
    if (isSuccess && key) {
      form.setValue('thumbnail', key, { shouldValidate: true });
    }
  }, [isSuccess, key, form]);

  const { createCourse } = useCreateCourse();
  const onSubmit = (values: GeneralInfoFormValues) => {
    createCourse({
      createCourseDto: values,
      handleSuccess: (courseId: string) => {
        onChangeCourseId(courseId);
        toast({ title: 'Tạo khóa học thành công', variant: 'success' });
        onNextStep();
      },
      handleError: () =>
        toast({
          variant: 'destructive',
          title: 'Tạo khóa học không thành công, vui lòng thử lại',
        }),
    });
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold">Thông tin chung</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-3 flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="thumbnail"
            render={() => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <DropzoneImage
                    onDrop={onDropImage}
                    onCloseImage={() => form.resetField('thumbnail')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miêu tả</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thể loại</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thể loại" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem
                        key={department.value}
                        value={department.value}
                      >
                        {department.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="ml-auto space-x-2">
            <Button>Tiếp tục</Button>
            {/* <Button type="button" onClick={onPrevStep} variant="secondary">
              Quay lại
            </Button> */}
          </div>
        </form>
      </Form>
    </div>
  );
}
