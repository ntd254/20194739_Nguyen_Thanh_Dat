import { UserLesson } from '@prisma/client';

export class UserLessonEntity implements UserLesson {
  id: string;
  userId: string;
  lessonId: string;
  score: number | null;
  createdAt: Date;
  updatedAt: Date | null;
}
