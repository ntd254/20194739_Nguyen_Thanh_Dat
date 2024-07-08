import {
  BadRequestException,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Course, User } from '@prisma/client';
import { Request } from 'express';
import { applicationFeeRate } from 'src/common/constant/application-fee-rate';
import { vndToUsdRate } from 'src/common/constant/vnd-to-usd-rate';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripeSdk: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripeSdk = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!);
  }

  async createConnectAccount(user: User) {
    const account = await this.stripeSdk.accounts.create({
      type: 'express',
      email: user.email,
      country: 'VN',
      capabilities: {
        transfers: { requested: true },
      },
      business_type: 'individual',
      individual: {
        email: user.email,
        first_name: user.name,
      },
      default_currency: 'VND',
      business_profile: {
        support_email: user.email,
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'daily',
            delay_days: 7,
          },
        },
      },
      tos_acceptance: {
        service_agreement: 'recipient',
      },
    });

    return account;
  }

  async createAccountLink(accountId: string) {
    const accountLink = await this.stripeSdk.accountLinks.create({
      account: accountId,
      type: 'account_onboarding',
      collection_options: { fields: 'eventually_due' },
      refresh_url: `${this.configService.get(
        'WEB_APP_URL',
      )}/instructor/courses`,
      return_url: `${this.configService.get('WEB_APP_URL')}/instructor/account`,
    });

    return accountLink;
  }

  async createLoginLink(accountId: string) {
    const loginLink = await this.stripeSdk.accounts.createLoginLink(accountId);

    return loginLink.url;
  }

  getEvent(req: RawBodyRequest<Request>) {
    const sig = req.headers['stripe-signature']!;
    const connectEndpointSecret = this.configService.get(
      'STRIPE_WEBHOOK_CONNECT_SECRET',
    );
    const platformEndpointSecret = this.configService.get(
      'STRIPE_WEBHOOK_ACCOUNT_SECRET',
    );

    let event: Stripe.Event;
    // Try both secrets to see if the event is for a connect account or platform account
    try {
      event = this.stripeSdk.webhooks.constructEvent(
        req.rawBody!,
        sig,
        connectEndpointSecret,
      );
    } catch (err: any) {
      if (err.type == 'StripeSignatureVerificationError') {
        try {
          event = this.stripeSdk.webhooks.constructEvent(
            req.rawBody!,
            sig,
            platformEndpointSecret,
          );
        } catch (err2: any) {
          throw new BadRequestException(`Webhook Error: ${err2.message}`);
        }
      } else {
        throw new BadRequestException(`Webhook Error: ${err.message}`);
      }
    }

    return event;
  }

  async createCheckoutCoursesSession(
    user: User,
    courses: (Course & {
      teacher: {
        stripeAccount: {
          accountId: string;
        } | null;
      };
    })[],
  ) {
    const session = await this.stripeSdk.checkout.sessions.create({
      customer_email: user.email,
      line_items: courses.map((course) => ({
        price_data: {
          currency: 'vnd',
          product_data: {
            name: course.title,
            description: course.description,
            images: [course.thumbnail],
          },
          unit_amount: course.price,
        },
        quantity: 1,
      })),
      metadata: {
        userId: user.id,
        courses: JSON.stringify(
          courses.map((course) => ({
            courseId: course.id,
            price: course.price,
            accountTeacherId: course.teacher.stripeAccount!.accountId,
          })),
        ),
        type: 'multiple',
      },
      mode: 'payment',
      success_url: `${this.configService.get('WEB_APP_URL')}/learn/courses`,
      cancel_url: `${this.configService.get('WEB_APP_URL')}/courses`,
    });

    return session;
  }

  async createCheckoutCourseSession(
    user: User,
    course: Course & {
      teacher: {
        stripeAccount: {
          accountId: string;
        } | null;
      };
    },
  ) {
    const session = await this.stripeSdk.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            product_data: {
              name: course.title,
              description: course.description,
              images: [course.thumbnail],
            },
            unit_amount: course.price,
          },
          quantity: 1,
        },
      ],
      metadata: { userId: user.id, courseId: course.id, type: 'single' },
      payment_intent_data: {
        application_fee_amount: Math.ceil(course.price * applicationFeeRate),
        transfer_data: {
          destination: course.teacher.stripeAccount!.accountId,
        },
      },
      mode: 'payment',
      success_url: `${this.configService.get('WEB_APP_URL')}/courses/${
        course.id
      }`,
      cancel_url: `${this.configService.get('WEB_APP_URL')}/courses/${
        course.id
      }`,
    });

    return session;
  }

  async getPaymentIntent(payment_intent: string) {
    const intent = await this.stripeSdk.paymentIntents.retrieve(payment_intent);

    return intent;
  }

  async transferToTeacher(
    latest_charge: string,
    accountTeacherId: string,
    price: number,
  ) {
    const transfer = await this.stripeSdk.transfers.create({
      // Stripe automatically converts the charge currency to the account currency (usd)
      // so need to convert the price to usd so that the transfer currency and charge currency match
      amount: Math.floor(price * (1 - applicationFeeRate) * vndToUsdRate) * 100, // * 100 to convert to cents
      currency: 'usd',
      source_transaction: latest_charge,
      destination: accountTeacherId,
    });

    return transfer;
  }
}
