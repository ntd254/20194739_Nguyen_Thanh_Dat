/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCheckoutResDto } from '../models/CreateCheckoutResDto';
import type { CreateCheckoutSessionDto } from '../models/CreateCheckoutSessionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export type TDataPaymentControllerCreateCheckoutSession = {
  requestBody: CreateCheckoutSessionDto,
}
export class PaymentService {
  /**
   * @returns CreateCheckoutResDto
   * @throws ApiError
   */
  public static paymentControllerCreateCheckoutSession(data: TDataPaymentControllerCreateCheckoutSession): CancelablePromise<CreateCheckoutResDto> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/payment/checkout-session',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
