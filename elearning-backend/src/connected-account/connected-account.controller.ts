import { Patch, Post } from '@nestjs/common';
import { ConnectedAccountService } from './connected-account.service';
import { LoggedInUser } from 'src/common/decorator/logged-in-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorator/api-controller.decorator';

@ApiController('connected-account')
@ApiBearerAuth()
export class ConnectedAccountController {
  constructor(
    private readonly connectedAccountService: ConnectedAccountService,
  ) {}

  @Post()
  create(@LoggedInUser('userId') userId: string) {
    return this.connectedAccountService.create(userId);
  }

  @Patch('finish-onboarding')
  finishOnboarding(@LoggedInUser('userId') userId: string) {
    return this.connectedAccountService.finishOnboarding(userId);
  }

  @Post('login-dashboard')
  async loginDashboard(@LoggedInUser('userId') userId: string) {
    return await this.connectedAccountService.loginDashboard(userId);
  }
}
