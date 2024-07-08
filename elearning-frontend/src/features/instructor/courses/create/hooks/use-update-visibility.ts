import {
  ApiError,
  CoursesService,
  UpdateCourseVisibilityDto,
} from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';

export const useUpdateVisibility = () => {
  const { mutate: update } = useMutation<
    unknown,
    ApiError,
    UpdateCourseVisibilityDto
  >({
    mutationFn: (data: UpdateCourseVisibilityDto) =>
      CoursesService.courseControllerUpdateCourseVisibility({
        requestBody: data,
      }),
  });

  return update;
};
