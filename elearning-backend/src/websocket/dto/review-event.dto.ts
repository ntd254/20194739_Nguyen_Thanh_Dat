import { IsUUID } from 'class-validator';

export class ReviewEventDto {
  @IsUUID('4')
  courseId: string;
}
