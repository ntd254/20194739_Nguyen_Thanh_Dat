import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/base/pagination-query.dto';
import { PaginationResDto } from 'src/common/base/pagination-res.dto';
import { PrismaService } from 'src/db/prisma.service';
import { MyNotificationDto } from './dto/res/my-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMyNotifications(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResDto<MyNotificationDto>> {
    const query: Prisma.NotificationWhereInput = {
      targetUserId: userId,
    };

    const [notifications, total] = await Promise.all([
      this.prismaService.notification.findMany({
        where: query,
        orderBy: { createdAt: 'desc' },
        skip: (paginationQuery.page - 1) * paginationQuery.limit,
        take: paginationQuery.limit,
        select: {
          id: true,
          type: true,
          read: true,
          sourceUser: { select: { id: true, name: true, avatar: true } },
          resourceId: true,
        },
      }),
      this.prismaService.notification.count({
        where: query,
      }),
    ]);

    const resources = await Promise.all(
      notifications.map((noti) => {
        switch (noti.type) {
          case 'NEW_COMMENT':
            return this.prismaService.comment.findUnique({
              where: { id: noti.resourceId },
              select: {
                id: true,
                content: true,
                lesson: {
                  select: {
                    id: true,
                    title: true,
                    section: { select: { courseId: true } },
                  },
                },
              },
            });
          case 'NEW_REVIEW':
            return this.prismaService.review.findUnique({
              where: { id: noti.resourceId },
              select: {
                id: true,
                content: true,
                rating: true,
                course: { select: { id: true, title: true } },
              },
            });
          case 'NEW_REPLY':
            return this.prismaService.comment.findUnique({
              where: { id: noti.resourceId },
              select: {
                id: true,
                content: true,
                parentId: true,
                lesson: {
                  select: {
                    id: true,
                    title: true,
                    section: { select: { courseId: true } },
                  },
                },
              },
            });
          case 'NEW_ENROLLMENT':
            return this.prismaService.courseEnrollment.findUnique({
              where: { id: noti.resourceId },
              select: {
                id: true,
                course: { select: { id: true, title: true } },
              },
            });
        }
      }),
    );

    return {
      results: notifications.map((noti, index) => ({
        ...noti,
        resource: resources[index],
      })),
      total,
      limit: paginationQuery.limit,
      page: paginationQuery.page,
    };
  }

  async getMyUnreadCount(userId: string) {
    return this.prismaService.notification.count({
      where: {
        targetUserId: userId,
        read: false,
      },
    });
  }

  async markAsRead(notificationId: string) {
    const notification = await this.prismaService.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }

    await this.prismaService.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
}
