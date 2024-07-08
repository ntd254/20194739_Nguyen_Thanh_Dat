import { UserCommentVote } from '@prisma/client';

export class UserCommentVoteEntity implements UserCommentVote {
  id: string;
  userId: string;
  commentId: string;
  createdAt: Date;
  updatedAt: Date | null;
}
