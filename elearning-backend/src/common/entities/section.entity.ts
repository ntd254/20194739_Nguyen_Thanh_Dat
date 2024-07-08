import { Section } from '@prisma/client';

export class SectionEntity implements Section {
  id: string;
  title: string;
  courseId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date | null;
}
