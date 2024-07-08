import { ApiProperty } from '@nestjs/swagger';
import { Department } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(Department)
  @ApiProperty({ enum: Department, enumName: 'Department' })
  department: Department;

  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;
}
