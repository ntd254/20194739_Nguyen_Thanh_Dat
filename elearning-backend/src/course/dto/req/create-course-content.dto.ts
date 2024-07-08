import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class AnswerDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;
}

class QuestionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  explain?: string;

  @IsArray()
  @ValidateNested()
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

class LessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID('4')
  @IsOptional()
  videoId?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsArray()
  @ValidateNested()
  @Type(() => QuestionDto)
  @IsOptional()
  questions?: QuestionDto[];
}

class SectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => LessonDto)
  lessons: LessonDto[];
}

export class CreateCourseContentDto {
  @IsUUID('4')
  courseId: string;

  @IsArray()
  @ValidateNested()
  @ArrayMinSize(1)
  @Type(() => SectionDto)
  sections: SectionDto[];
}
