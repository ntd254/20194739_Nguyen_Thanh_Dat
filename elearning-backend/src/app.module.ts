import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './db/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guard/auth.guard';
import { configSchema } from './config-schema';
import { CourseModule } from './course/course.module';
import { StorageModule } from './storage/storage.module';
import { StripeModule } from './stripe/stripe.module';
import { ConnectedAccountModule } from './connected-account/connected-account.module';
import { WebhookModule } from './webhook/webhook.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { LearnModule } from './learn/learn.module';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';
import { WebsocketModule } from './websocket/websocket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: configSchema, isGlobal: true }),
    PrismaModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          logging: configService.get<boolean>('DB_LOGGING')!,
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    StorageModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          bucketName: configService.get<string>('S3_BUCKET_NAME')!,
          region: configService.get<string>('S3_REGION')!,
          secretKey: configService.get<string>('S3_SECRET_KEY')!,
          accesskey: configService.get<string>('S3_ACCESS_KEY')!,
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
        };
      },
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        defaults: {
          from: '"Hust Course" <ntdat254@gmail.com>',
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    StripeModule,
    WebhookModule,
    ConnectedAccountModule,
    UserModule,
    PaymentModule,
    AuthModule,
    CourseModule,
    LearnModule,
    ReviewModule,
    NotificationModule,
    WebsocketModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
