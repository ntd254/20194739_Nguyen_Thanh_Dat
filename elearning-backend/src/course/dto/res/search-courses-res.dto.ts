import { PickType } from '@nestjs/swagger';
import { CourseEntity } from 'src/common/entities/course.entity';
import { UserEntity } from 'src/common/entities/user.entity';

class UserResDto extends PickType(UserEntity, ['name', 'avatar']) {}

export class SearchCoursesResDto extends PickType(CourseEntity, [
  'id',
  'title',
  'thumbnail',
]) {
  teacher: UserResDto;
}
