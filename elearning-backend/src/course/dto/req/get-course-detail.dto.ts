import { IsUUID } from 'class-validator';

export class GetCourseDetailDto {
  @IsUUID('4')
  courseId: string;
}
