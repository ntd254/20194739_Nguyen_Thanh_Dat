import { PickType } from '@nestjs/swagger';
import { CourseEntity } from 'src/common/entities/course.entity';

export class CreateCourseResDto extends PickType(CourseEntity, [
  'id',
  'title',
  'description',
  'price',
  'thumbnail',
  'public',
  'status',
] as const) {}
