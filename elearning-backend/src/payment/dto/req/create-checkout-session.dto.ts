import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayMinSize(1)
  courseIds: string[];
}
