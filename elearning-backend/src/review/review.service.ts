import { BadRequestException, Injectable } from '@nestjs/common';
import { GetReviewsDto } from 'src/course/dto/res/get-reviews.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async getReviewDetail(id: string): Promise<GetReviewsDto> {
    const review = await this.prismaService.review.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        rating: true,
        createdAt: true,
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
    if (!review) {
      throw new BadRequestException('Review not found');
    }

    return review;
  }
}
