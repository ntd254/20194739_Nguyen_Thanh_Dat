import { ApiProperty } from '@nestjs/swagger';
import { Status, Video } from '@prisma/client';

export class VideoEntity implements Video {
  id: string;
  objectKey: string;
  duration: number;
  @ApiProperty({ enum: Status, enumName: 'Status' })
  status: Status;
  createdAt: Date;
  updatedAt: Date | null;
}
