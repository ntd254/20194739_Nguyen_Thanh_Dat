import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import { CreateAccountDto } from './dto/res/create-account.dto';
import { LoginStripeDto } from './dto/res/login-stripe.dto';

@Injectable()
export class ConnectedAccountService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(userId: string): Promise<CreateAccountDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { stripeAccount: true },
    });

    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    if (user.stripeAccount) {
      throw new BadRequestException('Tài khoản đã được kết nối');
    }

    const account = await this.stripeService.createConnectAccount(user);

    const [{ url }] = await Promise.all([
      this.stripeService.createAccountLink(account.id),
      this.prismaService.stripeAccount.create({
        data: { accountId: account.id, userId: user.id },
      }),
    ]);

    return { url };
  }

  async finishOnboarding(userId: string): Promise<CreateAccountDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { stripeAccount: true },
    });

    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    if (!user.stripeAccount) {
      throw new BadRequestException('Tài khoản chưa được kết nối');
    }

    const { url } = await this.stripeService.createAccountLink(
      user.stripeAccount.accountId,
    );

    return { url };
  }

  async loginDashboard(userId: string): Promise<LoginStripeDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { stripeAccount: true },
    });

    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    if (!user.stripeAccount) {
      throw new BadRequestException('Tài khoản chưa được kết nối');
    }

    const url = await this.stripeService.createLoginLink(
      user.stripeAccount.accountId,
    );

    return { url };
  }
}
