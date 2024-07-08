/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvatarPresignedUrlDto } from '../models/AvatarPresignedUrlDto';
import type { CreateAvatarDto } from '../models/CreateAvatarDto';
import type { GetUserDto } from '../models/GetUserDto';
import type { MyLearningCourseDto } from '../models/MyLearningCourseDto';
import type { PaginationResDto } from '../models/PaginationResDto';
import type { UpdateProfileDto } from '../models/UpdateProfileDto';
import type { UserDetailDto } from '../models/UserDetailDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export type TDataUserControllerGetMyLearningCourses = {
  page: number,
  limit: number,
}
export type TDataUserControllerGetUserDetail = {
  id: string,
}
export type TDataUserControllerCreateAvatarPresignedUrl = {
  requestBody: CreateAvatarDto,
}
export type TDataUserControllerUpdateProfile = {
  requestBody: UpdateProfileDto,
}
export class UsersService {
  /**
   * @returns GetUserDto
   * @throws ApiError
   */
  public static userControllerGetMe(): CancelablePromise<GetUserDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/users/me',
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static userControllerGetMyLearningCourses(data: TDataUserControllerGetMyLearningCourses): CancelablePromise<(PaginationResDto & {
    results?: Array<MyLearningCourseDto>;
  } & {
    results: Array<MyLearningCourseDto>;
  })> {
    const {
      page,
      limit,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/users/my-learning-courses',
      query: {
        'page': page,
        'limit': limit,
      },
    });
  }
  /**
   * @returns UserDetailDto
   * @throws ApiError
   */
  public static userControllerGetUserDetail(data: TDataUserControllerGetUserDetail): CancelablePromise<UserDetailDto> {
    const {
      id,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/users/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * @returns AvatarPresignedUrlDto
   * @throws ApiError
   */
  public static userControllerCreateAvatarPresignedUrl(data: TDataUserControllerCreateAvatarPresignedUrl): CancelablePromise<AvatarPresignedUrlDto> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/users/avatar-presigned-url',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static userControllerUpdateProfile(data: TDataUserControllerUpdateProfile): CancelablePromise<any> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/users/my-profile',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
