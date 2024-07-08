import { Injectable, RawBodyRequest } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { PrismaService } from 'src/db/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';

@Injectable()
export class WebhookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  handleStripeWebhook(req: RawBodyRequest<Request>) {
    const event = this.stripeService.getEvent(req);

    switch (event.type) {
      case 'account.updated':
        this.handleAccountUpdated(event);
        break;
      case 'checkout.session.completed':
        this.handleCheckoutSessionCompleted(event);
        break;
    }

    return { received: true };
  }

  private async handleAccountUpdated(event: Stripe.AccountUpdatedEvent) {
    await this.prismaService.stripeAccount.update({
      where: { accountId: event.data.object.id },
      data: {
        chargesEnabled: event.data.object.charges_enabled,
        detailsSubmitted: event.data.object.details_submitted,
        payoutsEnabled: event.data.object.payouts_enabled,
      },
    });
  }

  private async handleCheckoutSessionCompleted(
    event: Stripe.CheckoutSessionCompletedEvent,
  ) {
    const session = event.data.object;
    const { userId, courseId, courses, type } = session.metadata as {
      userId: string;
      courseId?: string;
      courses?: string;
      type: 'single' | 'multiple';
    };

    switch (type) {
      case 'single': {
        await this.prismaService.$transaction(async (tx) => {
          const enrollment = await tx.courseEnrollment.create({
            data: { courseId: courseId!, userId },
          });
          const course = await tx.course.update({
            where: { id: courseId },
            data: { numberOfStudents: { increment: 1 } },
          });
          await tx.notification.create({
            data: {
              type: 'NEW_ENROLLMENT',
              fromUserId: userId,
              targetUserId: course.teacherId,
              resourceId: enrollment.id,
            },
          });
          this.eventEmitter.emit('new-enrollment', {
            teacherId: course.teacherId,
          });
        });
        break;
      }

      case 'multiple': {
        const parsedCourses = JSON.parse(courses!) as {
          courseId: string;
          price: number;
          accountTeacherId: string;
        }[];

        const paymentIntent = await this.stripeService.getPaymentIntent(
          session.payment_intent as string,
        );

        await Promise.all(
          parsedCourses.map(async (course) => {
            await this.stripeService.transferToTeacher(
              paymentIntent.latest_charge as string,
              course.accountTeacherId,
              course.price,
            );
          }),
        );

        await this.prismaService.$transaction(async (tx) => {
          await Promise.all(
            parsedCourses.map(async (parsedCourse) => {
              const enrollment = await tx.courseEnrollment.create({
                data: { courseId: parsedCourse.courseId, userId },
              });
              const course = await tx.course.update({
                where: { id: parsedCourse.courseId },
                data: { numberOfStudents: { increment: 1 } },
              });
              await tx.notification.create({
                data: {
                  type: 'NEW_ENROLLMENT',
                  fromUserId: userId,
                  targetUserId: course.teacherId,
                  resourceId: enrollment.id,
                },
              });
              this.eventEmitter.emit('new-enrollment', {
                teacherId: course.teacherId,
              });
            }),
          );
        });
        break;
      }
    }
  }
}
