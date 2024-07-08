/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DetailParamDto } from '../models/DetailParamDto';
import type { MyNotificationDto } from '../models/MyNotificationDto';
import type { PaginationResDto } from '../models/PaginationResDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export type TDataNotificationControllerGetMyNotifications = {
  page: number,
  limit: number,
}
export type TDataNotificationControllerMarkAsRead = {
  requestBody: DetailParamDto,
}
export class NotificationService {
  /**
   * @returns any
   * @throws ApiError
   */
  public static notificationControllerGetMyNotifications(data: TDataNotificationControllerGetMyNotifications): CancelablePromise<(PaginationResDto & {
    results?: Array<MyNotificationDto>;
  } & {
    results: Array<MyNotificationDto>;
  })> {
    const {
      page,
      limit,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/notification/my',
      query: {
        'page': page,
        'limit': limit,
      },
    });
  }
  /**
   * @returns number
   * @throws ApiError
   */
  public static notificationControllerGetMyUnreadCount(): CancelablePromise<number> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/notification/my-unread-count',
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static notificationControllerMarkAsRead(data: TDataNotificationControllerMarkAsRead): CancelablePromise<any> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/notification/mark-as-read',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
