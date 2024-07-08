import { IsUUID } from 'class-validator';

export class GetProgressDto {
  @IsUUID('4')
  courseId: string;
}
