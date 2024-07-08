import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsNumber()
  duration: number;
}
