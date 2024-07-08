import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ReviewCourseDto {
  @IsEnum(Rating)
  @ApiProperty({ enum: Rating, enumName: 'Rating' })
  rating: Rating;

  @IsString()
  @IsOptional()
  content?: string;
}
