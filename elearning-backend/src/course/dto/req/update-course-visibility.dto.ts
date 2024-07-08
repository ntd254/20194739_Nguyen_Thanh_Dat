import { IsBoolean, IsUUID } from 'class-validator';

export class UpdateCourseVisibilityDto {
  @IsUUID('4')
  courseId: string;

  @IsBoolean()
  isVisible: boolean;
}
