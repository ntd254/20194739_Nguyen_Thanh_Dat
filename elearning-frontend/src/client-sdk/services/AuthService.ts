/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginDto } from '../models/LoginDto';
import type { LoginGoogleDto } from '../models/LoginGoogleDto';
import type { LoginResponseDto } from '../models/LoginResponseDto';
import type { LogoutDto } from '../models/LogoutDto';
import type { RefreshTokenDto } from '../models/RefreshTokenDto';
import type { SignUpDto } from '../models/SignUpDto';
import type { SignUpResponseDto } from '../models/SignUpResponseDto';
import type { VerifyEmailDto } from '../models/VerifyEmailDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export type TDataAuthControllerLogin = {
  requestBody: LoginDto,
}
export type TDataAuthControllerLoginWithGoogle = {
  requestBody: LoginGoogleDto,
}
export type TDataAuthControllerSignUp = {
  requestBody: SignUpDto,
}
export type TDataAuthControllerVerifyEmail = {
  requestBody: VerifyEmailDto,
}
export type TDataAuthControllerRefreshToken = {
  requestBody: RefreshTokenDto,
}
export type TDataAuthControllerLogout = {
  requestBody: LogoutDto,
}
export class AuthService {
  /**
   * @returns LoginResponseDto
   * @throws ApiError
   */
  public static authControllerLogin(data: TDataAuthControllerLogin): CancelablePromise<LoginResponseDto> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/login',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns LoginResponseDto
   * @throws ApiError
   */
  public static authControllerLoginWithGoogle(data: TDataAuthControllerLoginWithGoogle): CancelablePromise<LoginResponseDto> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/login/google',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns SignUpResponseDto
   * @throws ApiError
   */
  public static authControllerSignUp(data: TDataAuthControllerSignUp): CancelablePromise<SignUpResponseDto> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/sign-up',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns LoginResponseDto
   * @throws ApiError
   */
  public static authControllerVerifyEmail(data: TDataAuthControllerVerifyEmail): CancelablePromise<LoginResponseDto> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/verify-email',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns LoginResponseDto
   * @throws ApiError
   */
  public static authControllerRefreshToken(data: TDataAuthControllerRefreshToken): CancelablePromise<LoginResponseDto> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/refresh-token',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static authControllerLogout(data: TDataAuthControllerLogout): CancelablePromise<any> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/logout',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
