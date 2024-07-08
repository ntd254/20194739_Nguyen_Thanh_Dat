import { ApiProperty } from '@nestjs/swagger';
import { Department, Rating } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/base/pagination-query.dto';

export enum PriceFilter {
  FREE = 'free',
  PAID = 'paid',
}

enum OrderCourseBy {
  RATE = 'rate',
  CREATED_AT = 'createdAt',
  STUDENTS = 'numberOfStudents',
}

export class GetCourseFilterDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsOptional()
  @IsEnum(Department, { each: true })
  @IsArray()
  @ApiProperty({ isArray: true, enum: Department, enumName: 'Department' })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return [value];
    }

    return value;
  })
  department?: Department[];

  @IsOptional()
  @IsEnum(PriceFilter, { each: true })
  @IsArray()
  @ApiProperty({ isArray: true, enum: PriceFilter, enumName: 'PriceFilter' })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return [value];
    }

    return value;
  })
  price?: PriceFilter[];

  @IsOptional()
  @IsEnum(Rating)
  @ApiProperty({ enum: Rating, enumName: 'Rating' })
  rating?: Rating;

  @IsOptional()
  @IsArray()
  @IsNumber(undefined, { each: true })
  @Type(() => Number)
  duration?: number[];

  @IsEnum(OrderCourseBy)
  @ApiProperty({ enum: OrderCourseBy, enumName: 'OrderCourseBy' })
  orderBy: OrderCourseBy;
}
