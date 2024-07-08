import { PickType } from '@nestjs/swagger';
import { CourseEntity } from 'src/common/entities/course.entity';
import { LinkEntity } from 'src/common/entities/link.entity';
import { UserEntity } from 'src/common/entities/user.entity';

export class UserDetailDto extends PickType(UserEntity, [
  'id',
  'name',
  'avatar',
  'bio',
]) {
  teachingCourses: TeachingCourseDto[];
  links: LinkUserDetailDto[];
}

class TeachingCourseDto extends PickType(CourseEntity, [
  'id',
  'numberOfStudents',
  'sumRating',
  'totalRating',
]) {}

class LinkUserDetailDto extends PickType(LinkEntity, [
  'id',
  'url',
  'website',
]) {}
