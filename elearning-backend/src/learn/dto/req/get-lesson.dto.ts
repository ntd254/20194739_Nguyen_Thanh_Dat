import { IsUUID } from 'class-validator';

export class GetLessonDto {
  @IsUUID('4')
  lessonId: string;
}
