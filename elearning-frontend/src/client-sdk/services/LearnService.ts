/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerCheckDto } from '../models/AnswerCheckDto';
import type { CheckAnswerDto } from '../models/CheckAnswerDto';
import type { CourseProgressDto } from '../models/CourseProgressDto';
import type { CreateCommentDto } from '../models/CreateCommentDto';
import type { GetCommentsResDto } from '../models/GetCommentsResDto';
import type { LessonResDto } from '../models/LessonResDto';
import type { MarkCompletedDto } from '../models/MarkCompletedDto';
import type { PaginationResDto } from '../models/PaginationResDto';
import type { ReviewCourseDto } from '../models/ReviewCourseDto';
import type { UpvoteCommentDto } from '../models/UpvoteCommentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export type TDataLearnControllerGetProgress = {
  courseId: string,
}
export type TDataLearnControllerGetLesson = {
  lessonId: string,
}
export type TDataLearnControllerGetComments = {
  lessonId: string,
  page: number,
  limit: number,
}
export type TDataLearnControllerCreateComment = {
  lessonId: string,
  requestBody: CreateCommentDto,
}
export type TDataLearnControllerGetReplies = {
  lessonId: string,
  commentId: string,
  page: number,
  limit: number,
}
export type TDataLearnControllerGetComment = {
  lessonId: string,
  commentId: string,
}
export type TDataLearnControllerUpvoteComment = {
  lessonId: string,
  commentId: string,
  requestBody: UpvoteCommentDto,
}
export type TDataLearnControllerCheckAnswer = {
  lessonId: string,
  requestBody: AnswerCheckDto,
}
export type TDataLearnControllerMarkCompleted = {
  lessonId: string,
  requestBody: MarkCompletedDto,
}
export type TDataLearnControllerCreateSignedCookies = {
  lessonId: string,
}
export type TDataLearnControllerReviewCourse = {
  courseId: string,
  requestBody: ReviewCourseDto,
}
export class LearnService {
  /**
   * @returns CourseProgressDto
   * @throws ApiError
   */
  public static learnControllerGetProgress(data: TDataLearnControllerGetProgress): CancelablePromise<CourseProgressDto> {
    const {
      courseId,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/learn/progress/{courseId}',
      path: {
        'courseId': courseId,
      },
    });
  }
  /**
   * @returns LessonResDto
   * @throws ApiError
   */
  public static learnControllerGetLesson(data: TDataLearnControllerGetLesson): CancelablePromise<LessonResDto> {
    const {
      lessonId,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/learn/lesson/{lessonId}',
      path: {
        'lessonId': lessonId,
      },
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static learnControllerGetComments(data: TDataLearnControllerGetComments): CancelablePromise<(PaginationResDto & {
    results?: Array<GetCommentsResDto>;
  } & {
    results: Array<GetCommentsResDto>;
  })> {
    const {
      lessonId,
      page,
      limit,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/learn/lesson/{lessonId}/comments',
      path: {
        'lessonId': lessonId,
      },
      query: {
        'page': page,
        'limit': limit,
      },
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static learnControllerCreateComment(data: TDataLearnControllerCreateComment): CancelablePromise<any> {
    const {
      lessonId,
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/learn/lesson/{lessonId}/comments',
      path: {
        'lessonId': lessonId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static learnControllerGetReplies(data: TDataLearnControllerGetReplies): CancelablePromise<(PaginationResDto & {
    results?: Array<GetCommentsResDto>;
  } & {
    results: Array<GetCommentsResDto>;
  })> {
    const {
      lessonId,
      commentId,
      page,
      limit,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/learn/lesson/{lessonId}/replies/{commentId}',
      path: {
        'lessonId': lessonId,
        'commentId': commentId,
      },
      query: {
        'page': page,
        'limit': limit,
      },
    });
  }
  /**
   * @returns GetCommentsResDto
   * @throws ApiError
   */
  public static learnControllerGetComment(data: TDataLearnControllerGetComment): CancelablePromise<GetCommentsResDto> {
    const {
      lessonId,
      commentId,
    } = data;
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/learn/lesson/{lessonId}/comments/{commentId}',
      path: {
        'lessonId': lessonId,
        'commentId': commentId,
      },
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static learnControllerUpvoteComment(data: TDataLearnControllerUpvoteComment): CancelablePromise<any> {
    const {
      lessonId,
      commentId,
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/learn/lesson/{lessonId}/upvote/{commentId}',
      path: {
        'lessonId': lessonId,
        'commentId': commentId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns CheckAnswerDto
   * @throws ApiError
   */
  public static learnControllerCheckAnswer(data: TDataLearnControllerCheckAnswer): CancelablePromise<CheckAnswerDto> {
    const {
      lessonId,
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/learn/lesson/{lessonId}/answers',
      path: {
        'lessonId': lessonId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static learnControllerMarkCompleted(data: TDataLearnControllerMarkCompleted): CancelablePromise<any> {
    const {
      lessonId,
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/learn/mark-completed/{lessonId}',
      path: {
        'lessonId': lessonId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static learnControllerCreateSignedCookies(data: TDataLearnControllerCreateSignedCookies): CancelablePromise<any> {
    const {
      lessonId,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/learn/signed-cookies-lesson/{lessonId}',
      path: {
        'lessonId': lessonId,
      },
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static learnControllerReviewCourse(data: TDataLearnControllerReviewCourse): CancelablePromise<any> {
    const {
      courseId,
      requestBody,
    } = data;
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/learn/review/{courseId}',
      path: {
        'courseId': courseId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
