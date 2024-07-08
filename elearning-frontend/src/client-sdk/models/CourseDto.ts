/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Department } from './Department';
import type { Status } from './Status';
import type { Teacher } from './Teacher';
export type CourseDto = {
  status: Status;
  department: Department;
  numberOfLessons: number;
  teacher: Teacher;
  id: string;
  duration: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  rate: number;
  sumRating: number;
  totalRating: number;
};

