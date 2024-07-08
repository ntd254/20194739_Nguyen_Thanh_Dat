import { PickType } from '@nestjs/swagger';
import { ReviewEntity } from 'src/common/entities/review.entity';
import { UserEntity } from 'src/common/entities/user.entity';

export class GetReviewsDto extends PickType(ReviewEntity, [
  'id',
  'content',
  'rating',
  'createdAt',
]) {
  user: UserReviewDto;
}

class UserReviewDto extends PickType(UserEntity, ['id', 'name', 'avatar']) {}
