import { Comment } from '@prisma/client';

export class CommentEntity implements Comment {
  id: string;
  userId: string;
  lessonId: string;
  content: string;
  parentId: string | null;
  numberOfReplies: number;
  numberOfVotes: number;
  createdAt: Date;
  updatedAt: Date | null;
}
