import { ApiProperty } from '@nestjs/swagger';
import { Rating, Review } from '@prisma/client';

export class ReviewEntity implements Review {
  id: string;
  userId: string;
  courseId: string;
  content: string | null;
  @ApiProperty({ enum: Rating, enumName: 'Rating' })
  rating: Rating;
  createdAt: Date;
  updatedAt: Date | null;
}
