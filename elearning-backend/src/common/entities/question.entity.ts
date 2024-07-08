import { Question } from '@prisma/client';

export class QuestionEntity implements Question {
  id: string;
  question: string;
  lessonId: string;
  explain: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
