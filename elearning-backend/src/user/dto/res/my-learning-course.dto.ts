import { PickType } from '@nestjs/swagger';
import { CourseEntity } from 'src/common/entities/course.entity';
import { LessonEntity } from 'src/common/entities/lesson.entity';
import { ReviewEntity } from 'src/common/entities/review.entity';
import { UserLessonEntity } from 'src/common/entities/user-lesson.entity';
import { UserEntity } from 'src/common/entities/user.entity';

export class MyLearningCourseDto extends PickType(CourseEntity, [
  'id',
  'title',
  'thumbnail',
]) {
  teacher: TeacherMyLearning;
  sections: SectionMyLearning[];
  reviews: ReviewLearning[];
}

class TeacherMyLearning extends PickType(UserEntity, [
  'id',
  'name',
  'avatar',
]) {}

class SectionMyLearning {
  lessons: LessonMyLearning[];
}

class LessonMyLearning extends PickType(LessonEntity, ['id']) {
  userLessons: UserLessonMyLearning[];
}

class ReviewLearning extends PickType(ReviewEntity, ['rating']) {}

class UserLessonMyLearning extends PickType(UserLessonEntity, ['id']) {}
