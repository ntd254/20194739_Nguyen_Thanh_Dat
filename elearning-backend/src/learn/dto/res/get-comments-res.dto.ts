import { PickType } from '@nestjs/swagger';
import { CommentEntity } from 'src/common/entities/comment.entity';
import { UserEntity } from 'src/common/entities/user.entity';

export class GetCommentsResDto extends PickType(CommentEntity, [
  'id',
  'content',
  'createdAt',
  'numberOfReplies',
  'numberOfVotes',
  'parentId',
]) {
  user: UserCommentDto;
}

class UserCommentDto extends PickType(UserEntity, ['id', 'name', 'avatar']) {}
