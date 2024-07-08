import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/req/login.dto';
import { PrismaService } from '../db/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/res/login-response.dto';
import { SignUpDto } from './dto/req/sign-up.dto';
import { SignUpResponseDto } from './dto/res/sign-up-response.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailDto } from './dto/req/verify-email.dto';
import { User } from '@prisma/client';
import { LoginGoogleDto } from './dto/req/login-google.dto';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { RefreshTokenDto } from './dto/req/refresh-token.dto';
import { LogoutDto } from './dto/req/logout.dto';

@Injectable()
export class AuthService {
  private readonly oauth2Client = new OAuth2Client();

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email, verified: true },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.password === null) {
      throw new BadRequestException('Account is registered with third party');
    }

    const isMatchPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isMatchPassword) {
      throw new BadRequestException('Password is incorrect');
    }

    const { accessToken, refreshToken } = await this.generatePairToken(user);

    return { accessToken, refreshToken, userId: user.id };
  }

  async loginWithGoogle(
    loginGoogleDto: LoginGoogleDto,
  ): Promise<LoginResponseDto> {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: loginGoogleDto.idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new BadRequestException('Token không hợp lệ');
      }
      const email = payload.email!;
      let user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (!user) {
        user = await this.prismaService.user.create({
          data: {
            email,
            name: payload.name!,
            verified: true,
            avatar: payload.picture!,
          },
        });
      }
      const { accessToken, refreshToken } = await this.generatePairToken(user);
      return { accessToken, refreshToken, userId: user.id };
    } catch {
      throw new BadRequestException('Token không hợp lệ');
    }
  }

  async signUp({
    email,
    name,
    password,
    redirect,
  }: SignUpDto): Promise<SignUpResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user) {
      throw new BadRequestException('Email đã tồn tại');
    }

    password = await bcrypt.hash(password, 10);

    const jwtPayload = { email };
    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '10m',
    });

    this.mailService.sendMail({
      to: email,
      subject: 'Verify your email',
      template: 'verify-email',
      context: {
        name: name,
        url: !redirect
          ? `${this.configService.get(
              'WEB_APP_URL',
            )}/sign-up/verify-email?token=${token}`
          : `${this.configService.get(
              'WEB_APP_URL',
            )}/sign-up/verify-email?token=${token}&redirect=${redirect}`,
      },
    });

    return await this.prismaService.user.create({
      data: { email, password, name },
      select: { id: true },
    });
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<LoginResponseDto> {
    try {
      const { email } = await this.jwtService.verifyAsync<{ email: string }>(
        verifyEmailDto.token,
      );
      const user = await this.prismaService.user.update({
        where: { email },
        data: { verified: true },
      });
      const { accessToken, refreshToken } = await this.generatePairToken(user);
      return { accessToken, refreshToken, userId: user.id };
    } catch {
      throw new BadRequestException('Code không hợp lệ');
    }
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponseDto> {
    try {
      await this.jwtService.verifyAsync(refreshTokenDto.accessToken);
    } catch (error: any) {
      if (error.name !== 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid access token');
      }
    }

    const refreshTokenEntity = await this.prismaService.refreshToken.findUnique(
      {
        where: { token: refreshTokenDto.refreshToken },
      },
    );
    if (!refreshTokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const [user] = await Promise.all([
      this.prismaService.user.findUnique({
        where: { id: refreshTokenEntity.userId },
      }),
      this.prismaService.refreshToken.delete({
        where: { token: refreshTokenDto.refreshToken },
      }),
    ]);
    const now = new Date();
    if (now > refreshTokenEntity.expiresAt) {
      throw new UnauthorizedException('Refresh token expired');
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { accessToken, refreshToken } = await this.generatePairToken(user);

    return { accessToken, refreshToken, userId: user.id };
  }

  private async generatePairToken(user: User) {
    const [accessToken, { token: refreshToken }] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: user.id,
          role: user.role,
        },
        { expiresIn: '30m' },
      ),
      this.prismaService.refreshToken.create({
        data: {
          userId: user.id,
          token: uuidv4(),
          expiresAt: add(new Date(), { days: 7 }),
        },
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async logout(logoutDto: LogoutDto) {
    const refreshTokenEntity = await this.prismaService.refreshToken.findUnique(
      { where: { token: logoutDto.refreshToken } },
    );
    if (!refreshTokenEntity) {
      throw new BadRequestException('Invalid refresh token');
    }
    await this.prismaService.refreshToken.delete({
      where: { id: refreshTokenEntity.id },
    });
  }
}
