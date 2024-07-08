import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class MarkCompletedDto {
  @IsBoolean()
  completed: boolean;

  @IsNumber()
  @IsOptional()
  score?: number;
}
