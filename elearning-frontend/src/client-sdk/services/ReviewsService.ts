/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetReviewsDto } from '../models/GetReviewsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export type TDataReviewControllerGetReviewDetail = {
  id: string,
}
export class ReviewsService {
  /**
   * @returns GetReviewsDto
   * @throws ApiError
   */
  public static reviewControllerGetReviewDetail(data: TDataReviewControllerGetReviewDetail): CancelablePromise<GetReviewsDto> {
    const {
      id,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/reviews/{id}',
      path: {
        'id': id,
      },
    });
  }
}
