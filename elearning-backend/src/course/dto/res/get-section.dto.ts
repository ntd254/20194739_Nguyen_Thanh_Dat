import { PickType } from '@nestjs/swagger';
import { SectionEntity } from 'src/common/entities/section.entity';

export class GetSectionDto extends PickType(SectionEntity, [
  'id',
  'title',
  'courseId',
  'createdAt',
  'updatedAt',
] as const) {}
