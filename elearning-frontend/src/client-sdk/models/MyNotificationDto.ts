/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentResource } from './CommentResource';
import type { EnrollmentResource } from './EnrollmentResource';
import type { NotificationType } from './NotificationType';
import type { ReplyResource } from './ReplyResource';
import type { ReviewResource } from './ReviewResource';
import type { UserNotification } from './UserNotification';
export type MyNotificationDto = {
  type: NotificationType;
  resource: (CommentResource | ReviewResource | ReplyResource | EnrollmentResource);
  sourceUser: UserNotification;
  id: string;
  read: boolean;
  resourceId: string;
};

