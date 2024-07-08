import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import { CreateCheckoutResDto } from './dto/res/create-checkout-res.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async createCheckoutSession(
    userId: string,
    courseIds: string[],
  ): Promise<CreateCheckoutResDto> {
    const [user, courses] = await Promise.all([
      this.prismaService.user.findUnique({ where: { id: userId } }),
      this.prismaService.course.findMany({
        where: {
          id: { in: courseIds },
          teacher: { stripeAccount: { isNot: null } },
        },
        include: {
          teacher: {
            select: { stripeAccount: { select: { accountId: true } } },
          },
        },
      }),
    ]);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    if (courses.length !== courseIds.length) {
      throw new BadRequestException(
        'Khóa học chưa sẵn sàng để thanh toán, vui lòng thử lại sau',
      );
    }

    if (courses.length === 1) {
      const session = await this.stripeService.createCheckoutCourseSession(
        user,
        courses[0],
      );

      return { url: session.url! };
    } else {
      const session = await this.stripeService.createCheckoutCoursesSession(
        user,
        courses,
      );

      return { url: session.url! };
    }
  }
}
