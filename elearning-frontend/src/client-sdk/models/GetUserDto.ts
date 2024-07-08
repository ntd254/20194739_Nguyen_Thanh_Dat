/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseEnrollmentDto } from './CourseEnrollmentDto';
import type { LinkUserDto } from './LinkUserDto';
import type { ReviewDto } from './ReviewDto';
import type { Role } from './Role';
import type { StripeAccountDto } from './StripeAccountDto';
import type { TeachingCoursesDto } from './TeachingCoursesDto';
import type { VoteCommentDto } from './VoteCommentDto';
export type GetUserDto = {
  role: Role;
  courseEnrollments: Array<CourseEnrollmentDto>;
  teachingCourses: Array<TeachingCoursesDto>;
  userCommentVotes: Array<VoteCommentDto>;
  reviews: Array<ReviewDto>;
  stripeAccount: StripeAccountDto | null;
  links: Array<LinkUserDto>;
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
};

