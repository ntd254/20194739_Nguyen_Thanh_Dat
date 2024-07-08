import { PickType } from '@nestjs/swagger';
import { CourseEntity } from 'src/common/entities/course.entity';
import { LessonEntity } from 'src/common/entities/lesson.entity';
import { SectionEntity } from 'src/common/entities/section.entity';
import { UserLessonEntity } from 'src/common/entities/user-lesson.entity';
import { VideoEntity } from 'src/common/entities/video.entity';

export class CourseProgressDto extends PickType(CourseEntity, ['id', 'title']) {
  sections: SectionProgressDto[];
}

class SectionProgressDto extends PickType(SectionEntity, ['id', 'title']) {
  lessons: LessonProgressDto[];
}

class LessonProgressDto extends PickType(LessonEntity, ['id', 'title']) {
  userLessons: UserLessonDto[];
  video: VideoDto | null;
}

class UserLessonDto extends PickType(UserLessonEntity, ['id']) {}

class VideoDto extends PickType(VideoEntity, ['id', 'duration']) {}
