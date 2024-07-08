import { OmitType, PickType } from '@nestjs/swagger';
import { CourseEntity } from 'src/common/entities/course.entity';
import { LessonEntity } from 'src/common/entities/lesson.entity';
import { SectionEntity } from 'src/common/entities/section.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { VideoEntity } from 'src/common/entities/video.entity';

export class CourseDetailDto extends OmitType(CourseEntity, [
  'teacherId',
  'createdAt',
  'updatedAt',
  'public',
] as const) {
  duration: number;
  sections: Section[];
  teacher: User;
}

class User extends PickType(UserEntity, ['id', 'name', 'avatar'] as const) {}

class Video extends PickType(VideoEntity, ['id', 'duration'] as const) {}

class Lesson extends PickType(LessonEntity, ['id', 'title'] as const) {
  video: Video | null;
}

class Section extends PickType(SectionEntity, ['id', 'title'] as const) {
  lessons: Lesson[];
}
