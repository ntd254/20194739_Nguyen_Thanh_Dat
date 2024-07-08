import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { GetProgressDto } from './dto/req/get-progress.dto';
import { CourseProgressDto } from './dto/res/course-progress.dto';
import { CreateSignedCookiesDto } from './dto/req/create-signed-cookies.dto';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { addDays } from 'date-fns';
import { getSignedCookies } from '@aws-sdk/cloudfront-signer';
import { GetLessonDto } from './dto/req/get-lesson.dto';
import { LessonResDto } from './dto/res/lesson-res.dto';
import { MarkCompletedDto } from './dto/req/mark-completed.dto';
import { PaginationQueryDto } from 'src/common/base/pagination-query.dto';
import { PaginationResDto } from 'src/common/base/pagination-res.dto';
import { GetCommentsResDto } from './dto/res/get-comments-res.dto';
import { Prisma } from '@prisma/client';
import { CommentParamDto } from './dto/req/comment-param.dto';
import { CreateCommentDto } from './dto/req/create-comment.dto';
import { UpvoteCommentDto } from './dto/req/upvote-comment.dto';
import { ReviewCourseDto } from './dto/req/review-course.dto';
import { CheckAnswerDto } from './dto/res/check-answer.dto';
import { AnswerCheckDto } from './dto/req/answer-check.dto';

@Injectable()
export class LearnService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getProgress(
    getProgressDto: GetProgressDto,
    userId: string,
  ): Promise<CourseProgressDto> {
    const courseProgress = await this.prismaService.course.findUnique({
      where: { id: getProgressDto.courseId },
      select: {
        id: true,
        title: true,
        sections: {
          select: {
            id: true,
            title: true,
            lessons: {
              select: {
                id: true,
                title: true,
                userLessons: {
                  select: { id: true },
                  where: { userId },
                },
                video: { select: { id: true, duration: true } },
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!courseProgress) {
      throw new BadRequestException('Không tìm thấy khóa học');
    }

    return courseProgress;
  }

  async createSignedCookies(createSignedCookiesDto: CreateSignedCookiesDto) {
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: createSignedCookiesDto.lessonId },
      include: { video: true },
    });
    if (!lesson) {
      throw new BadRequestException('Không tìm thấy bài học');
    }
    if (!lesson.video) {
      throw new BadRequestException('Bài học không có video');
    }

    const cloudfrontDomain =
      this.configService.get<string>('CLOUDFRONT_DOMAIN');
    const url = `https://${cloudfrontDomain}/videos/processed/${lesson.video.objectKey}/*`;
    const privateKey = await readFile('cloud_front_private_key.pem', {
      encoding: 'utf8',
    });
    const keyPairId = this.configService.get<string>(
      'CLOUDFRONT_PUBLIC_KEY_ID',
    )!;
    const dateLessThan = addDays(new Date(), 1);

    const policy = {
      Statement: [
        {
          Resource: url,
          Condition: {
            DateLessThan: {
              'AWS:EpochTime': Math.round(dateLessThan.getTime() / 1000), // time in seconds
            },
          },
        },
      ],
    };

    const cookies = getSignedCookies({
      keyPairId,
      privateKey,
      policy: JSON.stringify(policy),
    });

    return cookies;
  }

  async getLesson(
    getLessonDto: GetLessonDto,
    userId: string,
  ): Promise<LessonResDto> {
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: getLessonDto.lessonId },
      select: {
        id: true,
        title: true,
        video: { select: { objectKey: true, duration: true } },
        order: true,
        sectionId: true,
        questions: {
          select: {
            id: true,
            question: true,
            answers: {
              select: { id: true, answer: true },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        section: { select: { courseId: true } },
      },
    });
    if (!lesson) {
      throw new BadRequestException('Không tìm thấy bài học');
    }

    const course = await this.prismaService.course.findUnique({
      where: { id: lesson.section.courseId },
      select: {
        sections: {
          select: {
            lessons: { select: { id: true }, orderBy: { order: 'asc' } },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!course) {
      throw new BadRequestException('Không tìm thấy khóa học');
    }
    const lessonIds = course.sections.flatMap((section) =>
      section.lessons.map((lesson) => lesson.id),
    );

    const hasCompleted = await this.prismaService.userLesson.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
    });

    let url: string | undefined = undefined;
    if (lesson.video) {
      const cloudfrontDomain =
        this.configService.get<string>('CLOUDFRONT_DOMAIN');
      url = `https://${cloudfrontDomain}/videos/processed/${lesson.video.objectKey}/master.m3u8`;
    }

    return {
      ...lesson,
      url,
      hasCompleted: Boolean(hasCompleted),
      score: hasCompleted?.score || null,
      nextLessonId: lessonIds[lessonIds.indexOf(lesson.id) + 1],
      prevLessonId: lessonIds[lessonIds.indexOf(lesson.id) - 1],
    };
  }

  async markCompleted(
    lessonDto: GetLessonDto,
    userId: string,
    markCompletedDto: MarkCompletedDto,
  ) {
    const hasCompleted = await this.prismaService.userLesson.findUnique({
      where: { userId_lessonId: { userId, lessonId: lessonDto.lessonId } },
    });
    if (markCompletedDto.completed) {
      await this.prismaService.userLesson.upsert({
        create: {
          userId,
          lessonId: lessonDto.lessonId,
          score: markCompletedDto.score,
        },
        update: {
          score: markCompletedDto.score,
        },
        where: { userId_lessonId: { userId, lessonId: lessonDto.lessonId } },
      });
      return;
    }
    if (!markCompletedDto.completed && hasCompleted) {
      await this.prismaService.userLesson.delete({
        where: { userId_lessonId: { userId, lessonId: lessonDto.lessonId } },
      });
      return;
    }
  }

  async getComment(commentId: string): Promise<GetCommentsResDto> {
    const comment = await this.prismaService.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        numberOfReplies: true,
        numberOfVotes: true,
        user: { select: { id: true, name: true, avatar: true } },
        parentId: true,
      },
    });
    if (!comment) {
      throw new BadRequestException('Không tìm thấy bình luận');
    }

    return comment;
  }

  async getComments(
    getLessonDto: GetLessonDto,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginationResDto<GetCommentsResDto>> {
    const query: Prisma.CommentWhereInput = {
      lessonId: getLessonDto.lessonId,
      parentId: null,
    };

    const [comments, total] = await Promise.all([
      this.prismaService.comment.findMany({
        where: query,
        select: {
          id: true,
          content: true,
          createdAt: true,
          numberOfReplies: true,
          numberOfVotes: true,
          user: { select: { id: true, name: true, avatar: true } },
          parentId: true,
        },
        take: paginationQueryDto.limit,
        skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit,
        orderBy: [{ numberOfVotes: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prismaService.comment.count({
        where: query,
      }),
    ]);

    return {
      results: comments,
      total,
      limit: paginationQueryDto.limit,
      page: paginationQueryDto.page,
    };
  }

  async checkAnswer(answerDto: AnswerCheckDto): Promise<CheckAnswerDto> {
    const question = await this.prismaService.question.findUnique({
      where: { id: answerDto.questionId },
      select: { answers: { select: { id: true }, where: { correct: true } } },
    });
    if (!question) {
      throw new BadRequestException('Không tìm thấy câu hỏi');
    }

    const correctAnswers = question.answers.map((answer) => answer.id);
    if (correctAnswers.length !== answerDto.answerIds.length) {
      return { isCorrect: false };
    }

    const correctSet = new Set(correctAnswers);

    for (const answerId of answerDto.answerIds) {
      if (!correctSet.has(answerId)) {
        return { isCorrect: false };
      } else {
        correctSet.delete(answerId);
      }
    }

    return { isCorrect: correctSet.size === 0 };
  }

  async upvoteComment(
    commentParamDto: CommentParamDto,
    upvoteCommentDto: UpvoteCommentDto,
    userId: string,
  ) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id: commentParamDto.commentId },
    });
    if (!comment) {
      throw new BadRequestException('Không tìm thấy bình luận');
    }

    const hasVoted = await this.prismaService.userCommentVote.findUnique({
      where: { userId_commentId: { userId, commentId: comment.id } },
    });
    if (upvoteCommentDto.upvote && !hasVoted) {
      await this.prismaService.$transaction([
        this.prismaService.userCommentVote.create({
          data: { userId, commentId: commentParamDto.commentId },
        }),
        this.prismaService.comment.update({
          where: { id: commentParamDto.commentId },
          data: { numberOfVotes: comment.numberOfVotes + 1 },
        }),
      ]);
      return;
    }
    if (!upvoteCommentDto.upvote && hasVoted) {
      await this.prismaService.$transaction([
        this.prismaService.userCommentVote.delete({
          where: {
            userId_commentId: { userId, commentId: commentParamDto.commentId },
          },
        }),
        this.prismaService.comment.update({
          where: { id: commentParamDto.commentId },
          data: { numberOfVotes: comment.numberOfVotes - 1 },
        }),
      ]);
      return;
    }
  }

  async getReplies(
    getRepliesParam: CommentParamDto,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginationResDto<GetCommentsResDto>> {
    const query: Prisma.CommentWhereInput = {
      lessonId: getRepliesParam.lessonId,
      parentId: getRepliesParam.commentId,
    };

    const [replies, total] = await Promise.all([
      this.prismaService.comment.findMany({
        where: query,
        select: {
          id: true,
          content: true,
          createdAt: true,
          numberOfReplies: true,
          numberOfVotes: true,
          user: { select: { id: true, name: true, avatar: true } },
          parentId: true,
        },
        take: paginationQueryDto.limit,
        skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit,
        orderBy: [{ numberOfVotes: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prismaService.comment.count({
        where: query,
      }),
    ]);

    return {
      results: replies,
      total,
      limit: paginationQueryDto.limit,
      page: paginationQueryDto.page,
    };
  }

  async createComment(
    getLessonDto: GetLessonDto,
    createCommentDto: CreateCommentDto,
    userId: string,
  ) {
    const course = await this.prismaService.course.findFirst({
      where: {
        sections: {
          some: { lessons: { some: { id: getLessonDto.lessonId } } },
        },
      },
    });
    if (!course) {
      throw new BadRequestException('Không tìm thấy bài học');
    }

    if (!createCommentDto.parentId) {
      await this.prismaService.$transaction(async (tx) => {
        const comment = await tx.comment.create({
          data: {
            content: createCommentDto.content,
            lessonId: getLessonDto.lessonId,
            userId,
          },
        });
        if (course.teacherId !== userId) {
          await tx.notification.create({
            data: {
              type: 'NEW_COMMENT',
              resourceId: comment.id,
              fromUserId: userId,
              targetUserId: course.teacherId,
            },
          });
        }
      });
      return;
    }

    const parentComment = await this.prismaService.comment.findUnique({
      where: { id: createCommentDto.parentId },
    });
    if (!parentComment) {
      throw new BadRequestException('Không tìm thấy bình luận cha');
    }
    await this.prismaService.$transaction(async (tx) => {
      const [comment] = await Promise.all([
        tx.comment.create({
          data: {
            content: createCommentDto.content,
            lessonId: getLessonDto.lessonId,
            userId,
            parentId: createCommentDto.parentId,
          },
        }),
        tx.comment.update({
          where: { id: createCommentDto.parentId },
          data: { numberOfReplies: parentComment.numberOfReplies + 1 },
        }),
      ]);
      await tx.notification.createMany({
        data:
          parentComment.userId === userId
            ? [
                {
                  type: 'NEW_COMMENT',
                  resourceId: comment.id,
                  fromUserId: userId,
                  targetUserId: course.teacherId,
                },
              ]
            : [
                {
                  type: 'NEW_REPLY',
                  resourceId: comment.id,
                  fromUserId: userId,
                  targetUserId: parentComment.userId,
                },
                {
                  type: 'NEW_COMMENT',
                  resourceId: comment.id,
                  fromUserId: userId,
                  targetUserId: course.teacherId,
                },
              ],
      });
    });
  }

  async reviewCourse(
    courseId: string,
    userId: string,
    reviewDto: ReviewCourseDto,
  ) {
    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new BadRequestException('Không tìm thấy khóa học');
    }

    const hasReviewed = await this.prismaService.review.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (hasReviewed) {
      throw new BadRequestException('Bạn đã đánh giá khóa học này');
    }

    let rating: number;
    switch (reviewDto.rating) {
      case 'ONE':
        rating = 1;
        break;
      case 'TWO':
        rating = 2;
        break;
      case 'THREE':
        rating = 3;
        break;
      case 'FOUR':
        rating = 4;
        break;
      case 'FIVE':
        rating = 5;
        break;
      default:
        throw new BadRequestException('Rating không hợp lệ');
    }

    await this.prismaService.$transaction(async (tx) => {
      const [review] = await Promise.all([
        tx.review.create({
          data: {
            rating: reviewDto.rating,
            content: reviewDto.content,
            courseId,
            userId,
          },
        }),
        tx.course.update({
          where: { id: courseId },
          data: {
            totalRating: { increment: 1 },
            sumRating: { increment: rating },
            rate: Number(
              ((rating + course.sumRating) / (course.totalRating + 1)).toFixed(
                1,
              ),
            ),
          },
        }),
      ]);
      await tx.notification.create({
        data: {
          type: 'NEW_REVIEW',
          resourceId: review.id,
          fromUserId: userId,
          targetUserId: course.teacherId,
        },
      });
    });
  }
}
