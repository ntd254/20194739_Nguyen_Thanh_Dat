import { ApiProperty } from '@nestjs/swagger';
import { Website } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  bio?: string;

  @IsArray()
  @ValidateNested()
  @Type(() => LinkDto)
  @IsOptional()
  links?: LinkDto[];
}

class LinkDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsEnum(Website)
  @ApiProperty({ enum: Website, enumName: 'Website' })
  website: Website;
}
