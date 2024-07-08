import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsUUID('4')
  @IsOptional()
  parentId?: string;
}
