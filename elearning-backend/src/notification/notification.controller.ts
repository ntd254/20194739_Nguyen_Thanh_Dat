import { Body, Get, Patch, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiController } from 'src/common/decorator/api-controller.decorator';
import { ApiExtraModels } from '@nestjs/swagger';
import {
  CommentResource,
  EnrollmentResource,
  MyNotificationDto,
  ReplyResource,
  ReviewResource,
} from './dto/res/my-notification.dto';
import { ApiPaginatedResponse } from 'src/common/decorator/paginated-response.decorator';
import { LoggedInUser } from 'src/common/decorator/logged-in-user.decorator';
import { PaginationQueryDto } from 'src/common/base/pagination-query.dto';
import { DetailParamDto } from 'src/common/base/detail-param.dto';

@ApiController('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('my')
  @ApiExtraModels(
    ReviewResource,
    CommentResource,
    ReplyResource,
    EnrollmentResource,
  )
  @ApiPaginatedResponse(MyNotificationDto)
  getMyNotifications(
    @LoggedInUser('userId') userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.notificationService.getMyNotifications(userId, paginationQuery);
  }

  @Get('my-unread-count')
  getMyUnreadCount(@LoggedInUser('userId') userId: string) {
    return this.notificationService.getMyUnreadCount(userId);
  }

  @Patch('mark-as-read')
  markAsRead(@Body() detailDto: DetailParamDto) {
    return this.notificationService.markAsRead(detailDto.id);
  }
}
