/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAccountDto } from '../models/CreateAccountDto';
import type { LoginStripeDto } from '../models/LoginStripeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConnectedAccountService {
  /**
   * @returns CreateAccountDto
   * @throws ApiError
   */
  public static connectedAccountControllerCreate(): CancelablePromise<CreateAccountDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/connected-account',
    });
  }
  /**
   * @returns CreateAccountDto
   * @throws ApiError
   */
  public static connectedAccountControllerFinishOnboarding(): CancelablePromise<CreateAccountDto> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/connected-account/finish-onboarding',
    });
  }
  /**
   * @returns LoginStripeDto
   * @throws ApiError
   */
  public static connectedAccountControllerLoginDashboard(): CancelablePromise<LoginStripeDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/connected-account/login-dashboard',
    });
  }
}
