import { PickType } from '@nestjs/swagger';
import { CourseEnrollmentEntity } from 'src/common/entities/course-enrollment.entity';
import { CourseEntity } from 'src/common/entities/course.entity';
import { LinkEntity } from 'src/common/entities/link.entity';
import { ReviewEntity } from 'src/common/entities/review.entity';
import { StripeAccountEntity } from 'src/common/entities/stripe-account.entity';
import { UserCommentVoteEntity } from 'src/common/entities/user-comment-vote.entity';
import { UserEntity } from 'src/common/entities/user.entity';

class CourseEnrollmentDto extends PickType(CourseEnrollmentEntity, [
  'courseId',
]) {}

class TeachingCoursesDto extends PickType(CourseEntity, ['id']) {}

class VoteCommentDto extends PickType(UserCommentVoteEntity, ['commentId']) {}

class ReviewDto extends PickType(ReviewEntity, ['courseId']) {}

class StripeAccountDto extends PickType(StripeAccountEntity, [
  'accountId',
  'detailsSubmitted',
]) {}

class LinkUserDto extends PickType(LinkEntity, ['id', 'url', 'website']) {}

export class GetUserDto extends PickType(UserEntity, [
  'id',
  'email',
  'name',
  'avatar',
  'role',
  'bio',
]) {
  courseEnrollments: CourseEnrollmentDto[];
  teachingCourses: TeachingCoursesDto[];
  userCommentVotes: VoteCommentDto[];
  reviews: ReviewDto[];
  stripeAccount: StripeAccountDto | null;
  links: LinkUserDto[];
}
