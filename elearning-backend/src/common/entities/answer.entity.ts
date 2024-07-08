import { Answer } from '@prisma/client';

export class AnswerEntity implements Answer {
  id: string;
  answer: string;
  correct: boolean;
  questionId: string;
  createdAt: Date;
  updatedAt: Date | null;
}
