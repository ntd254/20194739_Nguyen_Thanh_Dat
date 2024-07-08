/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserCommentDto } from './UserCommentDto';
export type GetCommentsResDto = {
  user: UserCommentDto;
  id: string;
  content: string;
  createdAt: string;
  numberOfReplies: number;
  numberOfVotes: number;
  parentId: string | null;
};

