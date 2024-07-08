import { Body, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { LoggedInUser } from 'src/common/decorator/logged-in-user.decorator';
import { CreateCheckoutSessionDto } from './dto/req/create-checkout-session.dto';
import { ApiController } from 'src/common/decorator/api-controller.decorator';

@ApiController('payment')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout-session')
  createCheckoutSession(
    @LoggedInUser('userId') userId: string,
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    return this.paymentService.createCheckoutSession(
      userId,
      createCheckoutSessionDto.courseIds,
    );
  }
}
