/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseDetailDto } from '../models/CourseDetailDto';
import type { CourseDto } from '../models/CourseDto';
import type { CreateCourseContentDto } from '../models/CreateCourseContentDto';
import type { CreateCourseDto } from '../models/CreateCourseDto';
import type { CreateCourseResDto } from '../models/CreateCourseResDto';
import type { CreateThumbnailDto } from '../models/CreateThumbnailDto';
import type { CreateVideoDto } from '../models/CreateVideoDto';
import type { Department } from '../models/Department';
import type { DetailParamDto } from '../models/DetailParamDto';
import type { GetReviewsDto } from '../models/GetReviewsDto';
import type { GetSectionDto } from '../models/GetSectionDto';
import type { OrderCourseBy } from '../models/OrderCourseBy';
import type { PaginationResDto } from '../models/PaginationResDto';
import type { PriceFilter } from '../models/PriceFilter';
import type { Rating } from '../models/Rating';
import type { SearchCoursesResDto } from '../models/SearchCoursesResDto';
import type { UpdateCourseVisibilityDto } from '../models/UpdateCourseVisibilityDto';
import type { UploadThumbnailUrlDto } from '../models/UploadThumbnailUrlDto';
import type { UploadVideoUrlDto } from '../models/UploadVideoUrlDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export type TDataCourseControllerSearchCourses = {
  keyword: string,
}
export type TDataCourseControllerGetCourses = {
  orderBy: OrderCourseBy,
  page: number,
  limit: number,
  department?: Array<Department>,
  price?: Array<PriceFilter>,
  rating?: Rating,
  keyword?: string,
  duration?: Array<number>,
}
export type TDataCourseControllerCompleteConvertVideo = {
  objectId: string,
}
export type TDataCourseControllerGetCourseDetail = {
  courseId: string,
}
export type TDataCourseControllerGetCourseReview = {
  courseId: string,
  page: number,
  limit: number,
}
export type TDataCourseControllerCreateMyCourse = {
  requestBody: CreateCourseDto,
}
export type TDataCourseControllerEnrollFreeCourse = {
  requestBody: DetailParamDto,
}
export type TDataCourseControllerCreateCourseContent = {
  requestBody: CreateCourseContentDto,
}
export type TDataCourseControllerCreateVideoPresignedUrl = {
  requestBody: CreateVideoDto,
}
export type TDataCourseControllerCreateThumbnailPresignedUrl = {
  requestBody: CreateThumbnailDto,
}
export type TDataCourseControllerUpdateCourseVisibility = {
  requestBody: UpdateCourseVisibilityDto,
}
export class CoursesService {
  /**
   * @returns SearchCoursesResDto
   * @throws ApiError
   */
  public static courseControllerSearchCourses(data: TDataCourseControllerSearchCourses): CancelablePromise<Array<SearchCoursesResDto>> {
    const {
      keyword,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/courses/search',
      query: {
        'keyword': keyword,
      },
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static courseControllerGetCourses(data: TDataCourseControllerGetCourses): CancelablePromise<(PaginationResDto & {
    results?: Array<CourseDto>;
  } & {
    results: Array<CourseDto>;
  })> {
    const {
      orderBy,
      page,
      limit,
      department,
      price,
      rating,
      keyword,
      duration,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/courses',
      query: {
        'department': department,
        'price': price,
        'rating': rating,
        'orderBy': orderBy,
        'keyword': keyword,
        'duration': duration,
        'page': page,
        'limit': limit,
      },
    });
  }
  /**
   * @returns CreateCourseResDto
   * @throws ApiError
   */
  public static courseControllerGetMyTutorCourse(): CancelablePromise<Array<CreateCourseResDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/courses/my-tutor-courses',
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static courseControllerCompleteConvertVideo(data: TDataCourseControllerCompleteConvertVideo): CancelablePromise<any> {
    const {
      objectId,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/courses/complete-convert-video',
      query: {
        'objectId': objectId,
      },
    });
  }
  /**
   * @returns CourseDetailDto
   * @throws ApiError
   */
  public static courseControllerGetCourseDetail(data: TDataCourseControllerGetCourseDetail): CancelablePromise<CourseDetailDto> {
    const {
      courseId,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/courses/{courseId}',
      path: {
        'courseId': courseId,
      },
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static courseControllerGetCourseReview(data: TDataCourseControllerGetCourseReview): CancelablePromise<(PaginationResDto & {
    results?: Array<GetReviewsDto>;
  } & {
    results: Array<GetReviewsDto>;
  })> {
    const {
      courseId,
      page,
      limit,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/courses/{courseId}/reviews',
      path: {
        'courseId': courseId,
      },
      query: {
        'page': page,
        'limit': limit,
      },
    });
  }
  /**
   * @returns CreateCourseResDto
   * @throws ApiError
   */
  public static courseControllerCreateMyCourse(data: TDataCourseControllerCreateMyCourse): CancelablePromise<CreateCourseResDto> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/courses/my-courses',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static courseControllerEnrollFreeCourse(data: TDataCourseControllerEnrollFreeCourse): CancelablePromise<any> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/courses/enroll-free-course',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns GetSectionDto
   * @throws ApiError
   */
  public static courseControllerCreateCourseContent(data: TDataCourseControllerCreateCourseContent): CancelablePromise<Array<GetSectionDto>> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/courses/course-content',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns UploadVideoUrlDto
   * @throws ApiError
   */
  public static courseControllerCreateVideoPresignedUrl(data: TDataCourseControllerCreateVideoPresignedUrl): CancelablePromise<UploadVideoUrlDto> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/courses/video-presigned-url',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns UploadThumbnailUrlDto
   * @throws ApiError
   */
  public static courseControllerCreateThumbnailPresignedUrl(data: TDataCourseControllerCreateThumbnailPresignedUrl): CancelablePromise<UploadThumbnailUrlDto> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/courses/thumbnail-presigned-url',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static courseControllerUpdateCourseVisibility(data: TDataCourseControllerUpdateCourseVisibility): CancelablePromise<any> {
    const {
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/courses/course-visibility',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
