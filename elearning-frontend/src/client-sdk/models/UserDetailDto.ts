/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkUserDetailDto } from './LinkUserDetailDto';
import type { TeachingCourseDto } from './TeachingCourseDto';
export type UserDetailDto = {
  teachingCourses: Array<TeachingCourseDto>;
  links: Array<LinkUserDetailDto>;
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
};

