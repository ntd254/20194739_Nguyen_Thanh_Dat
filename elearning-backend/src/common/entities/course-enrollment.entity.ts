import { CourseEnrollment } from '@prisma/client';

export class CourseEnrollmentEntity implements CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date | null;
}
