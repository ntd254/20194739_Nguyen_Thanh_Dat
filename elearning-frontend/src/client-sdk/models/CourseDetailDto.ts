/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Department } from './Department';
import type { Section } from './Section';
import type { Status } from './Status';
import type { User } from './User';
export type CourseDetailDto = {
  status: Status;
  department: Department;
  duration: number;
  sections: Array<Section>;
  teacher: User;
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  numberOfStudents: number;
  rate: number;
  sumRating: number;
  totalRating: number;
};

