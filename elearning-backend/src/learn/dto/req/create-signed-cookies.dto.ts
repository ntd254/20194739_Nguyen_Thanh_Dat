import { IsUUID } from 'class-validator';

export class CreateSignedCookiesDto {
  @IsUUID('4')
  lessonId: string;
}
