import { IsString } from 'class-validator';

export class CreateAvatarDto {
  @IsString()
  fileName: string;
}
