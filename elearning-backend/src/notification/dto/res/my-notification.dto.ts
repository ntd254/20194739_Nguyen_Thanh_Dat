import { ApiProperty, PickType, getSchemaPath } from '@nestjs/swagger';
import { CommentEntity } from 'src/common/entities/comment.entity';
import { CourseEnrollmentEntity } from 'src/common/entities/course-enrollment.entity';
import { CourseEntity } from 'src/common/entities/course.entity';
import { LessonEntity } from 'src/common/entities/lesson.entity';
import { NotificationEntity } from 'src/common/entities/notification.entity';
import { ReviewEntity } from 'src/common/entities/review.entity';
import { SectionEntity } from 'src/common/entities/section.entity';
import { UserEntity } from 'src/common/entities/user.entity';

export class ReviewResource extends PickType(ReviewEntity, [
  'id',
  'content',
  'rating',
]) {
  course: CourseNotification;
}

export class CommentResource extends PickType(CommentEntity, [
  'id',
  'content',
]) {
  lesson: LessonNotification;
}

export class ReplyResource extends PickType(CommentEntity, [
  'id',
  'content',
  'parentId',
]) {
  lesson: LessonNotification;
}

export class EnrollmentResource extends PickType(CourseEnrollmentEntity, [
  'id',
]) {
  course: CourseNotification;
}

export class MyNotificationDto extends PickType(NotificationEntity, [
  'id',
  'type',
  'read',
  'resourceId',
]) {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(CommentResource) },
      { $ref: getSchemaPath(ReviewResource) },
      { $ref: getSchemaPath(ReplyResource) },
      { $ref: getSchemaPath(EnrollmentResource) },
    ],
  })
  resource:
    | CommentResource
    | ReviewResource
    | ReplyResource
    | EnrollmentResource
    | null;
  sourceUser: UserNotification;
}

class UserNotification extends PickType(UserEntity, ['id', 'name', 'avatar']) {}

class LessonNotification extends PickType(LessonEntity, ['id', 'title']) {
  section: SectionNotification;
}

class SectionNotification extends PickType(SectionEntity, ['courseId']) {}

class CourseNotification extends PickType(CourseEntity, ['id', 'title']) {}
