import { CoursesService, CreateCourseDto } from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';

export const useCreateCourse = () => {
  const { mutate: createCourse } = useMutation({
    mutationFn: ({
      createCourseDto,
    }: {
      createCourseDto: CreateCourseDto;
      handleSuccess: (courseId: string) => void;
      handleError: () => void;
    }) =>
      CoursesService.courseControllerCreateMyCourse({
        requestBody: createCourseDto,
      }),
    onSuccess: (course, { handleSuccess }) => handleSuccess(course.id),
    onError: (_, { handleError }) => handleError(),
  });

  return { createCourse };
};
