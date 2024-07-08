import { IsNotEmpty, IsString } from 'class-validator';

export class CreateThumbnailDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
