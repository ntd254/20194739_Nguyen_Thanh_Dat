import { IsUUID } from 'class-validator';

export class CourseParamDto {
  @IsUUID('4')
  courseId: string;
}
