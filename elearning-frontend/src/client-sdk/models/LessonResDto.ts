/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionLessonResDto } from './QuestionLessonResDto';
import type { VideoLessonResDto } from './VideoLessonResDto';
export type LessonResDto = {
  url?: string;
  hasCompleted: boolean;
  video: VideoLessonResDto | null;
  nextLessonId?: string;
  prevLessonId?: string;
  questions: Array<QuestionLessonResDto>;
  score: number | null;
  id: string;
  title: string;
};

