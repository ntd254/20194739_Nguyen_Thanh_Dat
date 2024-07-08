import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LearnService } from './learn.service';
import { ApiController } from 'src/common/decorator/api-controller.decorator';
import { GetProgressDto } from './dto/req/get-progress.dto';
import { LoggedInUser } from 'src/common/decorator/logged-in-user.decorator';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateSignedCookiesDto } from './dto/req/create-signed-cookies.dto';
import { Request, Response } from 'express';
import { GetLessonDto } from './dto/req/get-lesson.dto';
import { OwnCourseGuard } from 'src/common/guard/own-course.guard';
import { MarkCompletedDto } from './dto/req/mark-completed.dto';
import { PaginationQueryDto } from 'src/common/base/pagination-query.dto';
import { ApiPaginatedResponse } from 'src/common/decorator/paginated-response.decorator';
import { GetCommentsResDto } from './dto/res/get-comments-res.dto';
import { CommentParamDto } from './dto/req/comment-param.dto';
import { CreateCommentDto } from './dto/req/create-comment.dto';
import { UpvoteCommentDto } from './dto/req/upvote-comment.dto';
import { CourseParamDto } from './dto/req/course-param.dto';
import { ReviewCourseDto } from './dto/req/review-course.dto';
import { ConfigService } from '@nestjs/config';
import { AnswerCheckDto } from './dto/req/answer-check.dto';

@ApiController('learn')
@ApiBearerAuth()
@UseGuards(OwnCourseGuard)
export class LearnController {
  constructor(
    private readonly learnService: LearnService,
    private readonly configService: ConfigService,
  ) {}

  @Get('progress/:courseId')
  getProgress(
    @Param() getProgressDto: GetProgressDto,
    @LoggedInUser('userId') userId: string,
  ) {
    return this.learnService.getProgress(getProgressDto, userId);
  }

  @Get('lesson/:lessonId')
  getLesson(
    @Param() getLessonDto: GetLessonDto,
    @LoggedInUser('userId') userId: string,
  ) {
    return this.learnService.getLesson(getLessonDto, userId);
  }

  @Get('lesson/:lessonId/comments')
  @ApiPaginatedResponse(GetCommentsResDto)
  getComments(
    @Param() getLessonDto: GetLessonDto,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.learnService.getComments(getLessonDto, paginationQueryDto);
  }

  @Get('lesson/:lessonId/replies/:commentId')
  @ApiPaginatedResponse(GetCommentsResDto)
  getReplies(
    @Param() getRepliesParam: CommentParamDto,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.learnService.getReplies(getRepliesParam, paginationQueryDto);
  }

  @Get('lesson/:lessonId/comments/:commentId')
  getComment(@Param() commentParamDto: CommentParamDto) {
    return this.learnService.getComment(commentParamDto.commentId);
  }

  @Patch('lesson/:lessonId/upvote/:commentId')
  upvoteComment(
    @Param() commentParamDto: CommentParamDto,
    @Body() upvoteCommentDto: UpvoteCommentDto,
    @LoggedInUser('userId') userId: string,
  ) {
    return this.learnService.upvoteComment(
      commentParamDto,
      upvoteCommentDto,
      userId,
    );
  }

  @Post('lesson/:lessonId/answers')
  @ApiParam({ name: 'lessonId', type: 'string' })
  checkAnswer(@Body() answerDto: AnswerCheckDto) {
    return this.learnService.checkAnswer(answerDto);
  }

  @Post('lesson/:lessonId/comments')
  createComment(
    @Param() getLessonDto: GetLessonDto,
    @Body() createCommentDto: CreateCommentDto,
    @LoggedInUser('userId') userId: string,
  ) {
    return this.learnService.createComment(
      getLessonDto,
      createCommentDto,
      userId,
    );
  }

  @Patch('mark-completed/:lessonId')
  markCompleted(
    @Param() lessonDto: GetLessonDto,
    @Body() markCompletedDto: MarkCompletedDto,
    @LoggedInUser('userId') userId: string,
  ) {
    return this.learnService.markCompleted(lessonDto, userId, markCompletedDto);
  }

  @Post('signed-cookies-lesson/:lessonId')
  @HttpCode(HttpStatus.OK)
  async createSignedCookies(
    @Param() createSignedCookiesDto: CreateSignedCookiesDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookies = await this.learnService.createSignedCookies(
      createSignedCookiesDto,
    );
    Object.entries(cookies).forEach(([key, value]) => {
      response.cookie(key, value, {
        httpOnly: true,
        secure: true,
        // Set domain to also allow subdomains
        domain: this.configService.get<string>('DOMAIN'),
        sameSite: 'none',
      });
    });
  }

  @Post('review/:courseId')
  async reviewCourse(
    @Param() courseParamDto: CourseParamDto,
    @Body() reviewDto: ReviewCourseDto,
    @LoggedInUser('userId') userId: string,
  ) {
    return this.learnService.reviewCourse(
      courseParamDto.courseId,
      userId,
      reviewDto,
    );
  }
}
