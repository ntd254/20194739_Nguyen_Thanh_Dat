/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReviewLearning } from './ReviewLearning';
import type { SectionMyLearning } from './SectionMyLearning';
import type { TeacherMyLearning } from './TeacherMyLearning';
export type MyLearningCourseDto = {
  teacher: TeacherMyLearning;
  sections: Array<SectionMyLearning>;
  reviews: Array<ReviewLearning>;
  id: string;
  title: string;
  thumbnail: string;
};

