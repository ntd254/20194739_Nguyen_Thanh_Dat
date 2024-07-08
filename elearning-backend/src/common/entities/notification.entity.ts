import { ApiProperty } from '@nestjs/swagger';
import { Notification, NotificationType } from '@prisma/client';

export class NotificationEntity implements Notification {
  id: string;
  targetUserId: string;
  fromUserId: string;
  read: boolean;
  resourceId: string;
  @ApiProperty({ enum: NotificationType, enumName: 'NotificationType' })
  type: NotificationType;
  createdAt: Date;
  updatedAt: Date | null;
}
