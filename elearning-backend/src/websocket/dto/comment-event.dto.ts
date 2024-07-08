import { IsOptional, IsUUID } from 'class-validator';

export class CommentEventDto {
  @IsUUID('4')
  courseId: string;

  @IsUUID('4')
  @IsOptional()
  parentId?: string;
}
