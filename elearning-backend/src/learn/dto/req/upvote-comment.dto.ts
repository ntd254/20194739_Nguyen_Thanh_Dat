import { IsBoolean } from 'class-validator';

export class UpvoteCommentDto {
  @IsBoolean()
  upvote: boolean;
}
