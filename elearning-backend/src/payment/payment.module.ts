import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [StripeModule],
})
export class PaymentModule {}
