import { Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/req/login.dto';
import { SignUpDto } from './dto/req/sign-up.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { VerifyEmailDto } from './dto/req/verify-email.dto';
import { ApiController } from 'src/common/decorator/api-controller.decorator';
import { LoginGoogleDto } from './dto/req/login-google.dto';
import { RefreshTokenDto } from './dto/req/refresh-token.dto';
import { LogoutDto } from './dto/req/logout.dto';

@ApiController('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('login/google')
  @Public()
  @HttpCode(HttpStatus.OK)
  loginWithGoogle(@Body() loginGoogleDto: LoginGoogleDto) {
    return this.authService.loginWithGoogle(loginGoogleDto);
  }

  @Post('sign-up')
  @Public()
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('verify-email')
  @Public()
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('refresh-token')
  @Public()
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }
}
