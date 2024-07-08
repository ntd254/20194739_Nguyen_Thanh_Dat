import {
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import { WebhookService } from './webhook.service';
import { Request } from 'express';
import { ApiController } from 'src/common/decorator/api-controller.decorator';

@ApiController('webhook')
@Public()
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(@Req() req: RawBodyRequest<Request>) {
    return this.webhookService.handleStripeWebhook(req);
  }
}
