import { ApiProperty } from '@nestjs/swagger';
import { Link, Website } from '@prisma/client';

export class LinkEntity implements Link {
  id: string;
  userId: string;
  url: string;
  @ApiProperty({ enum: Website, enumName: 'Website' })
  website: Website;
  createdAt: Date;
  updatedAt: Date | null;
}
