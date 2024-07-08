/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserLessonDto } from './UserLessonDto';
import type { VideoDto } from './VideoDto';
export type LessonProgressDto = {
  userLessons: Array<UserLessonDto>;
  video: VideoDto | null;
  id: string;
  title: string;
};

