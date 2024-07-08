import { Module } from '@nestjs/common';
import { ConnectedAccountController } from './connected-account.controller';
import { ConnectedAccountService } from './connected-account.service';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  controllers: [ConnectedAccountController],
  providers: [ConnectedAccountService],
  imports: [StripeModule],
})
export class ConnectedAccountModule {}
