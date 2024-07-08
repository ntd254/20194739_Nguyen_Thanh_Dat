import { IsUUID } from 'class-validator';
import { GetLessonDto } from './get-lesson.dto';

export class CommentParamDto extends GetLessonDto {
  @IsUUID('4')
  commentId: string;
}
