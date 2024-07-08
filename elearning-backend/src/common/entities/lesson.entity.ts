import { Lesson } from '@prisma/client';

export class LessonEntity implements Lesson {
  id: string;
  title: string;
  sectionId: string;
  videoId: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date | null;
}
