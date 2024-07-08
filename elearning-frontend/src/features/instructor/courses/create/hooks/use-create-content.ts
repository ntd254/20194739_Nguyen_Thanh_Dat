import { useMutation } from '@tanstack/react-query';
import { CourseContentFormValues } from '../course-content';
import { CoursesService } from '@/client-sdk';
import { useToast } from '@/components/ui/use-toast';

export const useCreateContent = () => {
  const { toast } = useToast();

  const { mutate: createContent } = useMutation({
    mutationFn: ({ data }: { data: CourseContentFormValues }) => {
      return CoursesService.courseControllerCreateCourseContent({
        requestBody: data,
      });
    },
    onSuccess: () => {
      toast({ title: 'Nội dung khóa học đã được tạo', variant: 'success' });
    },
  });

  return { createContent };
};
