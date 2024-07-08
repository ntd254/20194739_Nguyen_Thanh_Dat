import { IsString, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  accessToken: string;

  @IsUUID('4')
  refreshToken: string;
}
