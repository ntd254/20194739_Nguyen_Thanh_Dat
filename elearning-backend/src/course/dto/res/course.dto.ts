import { PickType } from '@nestjs/swagger';
import { CourseEntity } from 'src/common/entities/course.entity';
import { UserEntity } from 'src/common/entities/user.entity';

class Teacher extends PickType(UserEntity, ['id', 'name', 'avatar'] as const) {}

export class CourseDto extends PickType(CourseEntity, [
  'id',
  'status',
  'department',
  'duration',
  'title',
  'description',
  'price',
  'thumbnail',
  'rate',
  'sumRating',
  'totalRating',
] as const) {
  numberOfLessons: number;
  teacher: Teacher;
}
