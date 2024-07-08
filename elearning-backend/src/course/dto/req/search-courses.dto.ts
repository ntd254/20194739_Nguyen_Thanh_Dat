import { IsString } from 'class-validator';

export class SearchCoursesDto {
  @IsString()
  keyword: string;
}
