import { IsUUID } from 'class-validator';

export class DetailParamDto {
  @IsUUID('4')
  id: string;
}
