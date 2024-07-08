import { PickType } from '@nestjs/swagger';
import { AnswerEntity } from 'src/common/entities/answer.entity';
import { LessonEntity } from 'src/common/entities/lesson.entity';
import { QuestionEntity } from 'src/common/entities/question.entity';
import { VideoEntity } from 'src/common/entities/video.entity';

export class LessonResDto extends PickType(LessonEntity, ['id', 'title']) {
  url?: string;
  hasCompleted: boolean;
  video: VideoLessonResDto | null;
  nextLessonId?: string;
  prevLessonId?: string;
  questions: QuestionLessonResDto[];
  score: number | null;
}

class VideoLessonResDto extends PickType(VideoEntity, [
  'objectKey',
  'duration',
]) {}

class QuestionLessonResDto extends PickType(QuestionEntity, [
  'id',
  'question',
]) {
  answers: AnswerLessonResDto[];
}

class AnswerLessonResDto extends PickType(AnswerEntity, ['id', 'answer']) {}
