import { IsUUID } from 'class-validator';

export class LogoutDto {
  @IsUUID('4')
  refreshToken: string;
}
