import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Prisma, Status } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { CreateCourseDto } from './dto/req/create-course.dto';
import { CreateThumbnailDto } from './dto/req/create-thumbnail.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { StorageService } from 'src/storage/storage.service';
import { UploadThumbnailUrlDto } from './dto/res/upload-thumbnail-url.dto';
import { ConfigService } from '@nestjs/config';
import { CreateCourseContentDto } from './dto/req/create-course-content.dto';
import { GetSectionDto } from './dto/res/get-section.dto';
import { CreateVideoDto } from './dto/req/create-video.dto';
import { UploadVideoUrlDto } from './dto/res/upload-video-url.dto';
import {
  GetCourseFilterDto,
  PriceFilter,
} from './dto/req/get-course-filter.dto';
import { CreateCourseResDto } from './dto/res/create-course-res.dto';
import { CourseDto } from './dto/res/course.dto';
import { PaginationResDto } from 'src/common/base/pagination-res.dto';
import { GetCourseDetailDto } from './dto/req/get-course-detail.dto';
import { CourseDetailDto } from './dto/res/course-detail.dto';
import { SearchCoursesDto } from './dto/req/search-courses.dto';
import { SearchCoursesResDto } from './dto/res/search-courses-res.dto';
import { PaginationQueryDto } from 'src/common/base/pagination-query.dto';
import { GetReviewsDto } from './dto/res/get-reviews.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateCourseVisibilityDto } from './dto/req/update-course-visibility.dto';
import { convertRating } from 'src/common/utils/convert-rating';

@Injectable()
export class CourseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly mailService: MailerService,
  ) {}

  async searchCourses(
    searchCoursesDto: SearchCoursesDto,
  ): Promise<SearchCoursesResDto[]> {
    const keyword = searchCoursesDto.keyword.trim();

    const query = keyword.replaceAll(' ', ' & ');
    const searchKeyword = `%${keyword}%`;

    const courses = await this.prismaService.$queryRaw<
      {
        id: string;
        title: string;
        thumbnail: string;
        name: string;
        avatar: string;
        rank: number;
      }[]
    >`
      SELECT c.id, c.title, c.thumbnail, u.name, u.avatar, ts_rank(to_tsvector(title || ' ' || description), to_tsquery(${query})) as rank
      FROM "Course" c INNER JOIN "User" u ON c."teacherId" = u."id"
      WHERE (c."title" ILIKE ${searchKeyword} OR c."description" ILIKE ${searchKeyword}) AND public = true AND status = 'COMPLETED'
      ORDER BY rank DESC, c."sumRating" DESC
      LIMIT 6`;

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail,
      teacher: {
        name: course.name,
        avatar: course.avatar,
      },
    }));
  }

  async getCourseDetail(
    getCourseDetailDto: GetCourseDetailDto,
  ): Promise<CourseDetailDto> {
    const course = await this.prismaService.course.findUnique({
      where: {
        id: getCourseDetailDto.courseId,
        public: true,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        thumbnail: true,
        department: true,
        numberOfStudents: true,
        status: true,
        sumRating: true,
        totalRating: true,
        rate: true,
        sections: {
          select: {
            id: true,
            title: true,
            lessons: {
              select: {
                id: true,
                title: true,
                video: { select: { id: true, duration: true } },
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    const duration = course.sections
      .flatMap((section) =>
        section.lessons.map((lesson) => {
          if (!lesson.video) {
            return 0;
          }
          return lesson.video.duration;
        }),
      )
      .reduce((total, cur) => total + cur, 0);

    return {
      ...course,
      duration,
    };
  }

  async getCourses(
    filter: GetCourseFilterDto,
  ): Promise<PaginationResDto<CourseDto>> {
    const query: Prisma.CourseWhereInput = {
      AND: [
        {
          public: true,
          status: 'COMPLETED',
          department: { in: filter.department },
        },
        {
          OR: [
            { title: { contains: filter.keyword, mode: 'insensitive' } },
            { description: { contains: filter.keyword, mode: 'insensitive' } },
          ],
        },
        {
          OR: [
            ...(filter.price?.map((price) => ({
              price: price === PriceFilter.FREE ? 0 : { not: 0 },
            })) || []),
          ],
        },
        {
          rate: { gte: convertRating(filter.rating) },
        },
        {
          duration: filter.duration?.length
            ? { gte: filter.duration[0] * 60, lte: filter.duration[1] * 60 }
            : undefined,
        },
      ],
    };

    const coursesReq = this.prismaService.course.findMany({
      where: query,
      skip: (filter.page - 1) * filter.limit,
      take: filter.limit,
      select: {
        id: true,
        title: true,
        status: true,
        description: true,
        price: true,
        thumbnail: true,
        department: true,
        public: true,
        sumRating: true,
        totalRating: true,
        duration: true,
        rate: true,
        sections: {
          select: {
            lessons: { select: { video: { select: { duration: true } } } },
          },
        },
        teacher: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: {
        [filter.orderBy]: 'desc',
      },
    });

    const totalReq = this.prismaService.course.count({ where: query });

    const [courses, total] = await Promise.all([coursesReq, totalReq]);

    const courseDtos: CourseDto[] = courses.map((course) => {
      const videos = course.sections
        .flatMap((section) => section.lessons)
        .map((lesson) => lesson.video);

      return {
        ...course,
        numberOfLessons: videos.length,
      };
    });

    return {
      results: courseDtos,
      total,
      limit: filter.limit,
      page: filter.page,
    };
  }

  async getCourseReview(
    getCourseDetailDto: GetCourseDetailDto,
    filter: PaginationQueryDto,
  ): Promise<PaginationResDto<GetReviewsDto>> {
    const course = await this.prismaService.course.findUnique({
      where: { id: getCourseDetailDto.courseId },
    });
    if (!course) {
      throw new BadRequestException('Course not found');
    }

    const [reviews, total] = await Promise.all([
      this.prismaService.review.findMany({
        where: { courseId: getCourseDetailDto.courseId },
        select: {
          id: true,
          content: true,
          rating: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
      }),
      this.prismaService.review.count({
        where: { courseId: getCourseDetailDto.courseId },
      }),
    ]);

    return {
      results: reviews,
      total,
      limit: filter.limit,
      page: filter.page,
    };
  }

  async getMyTutorCourse(userId: string): Promise<CreateCourseResDto[]> {
    const courses = await this.prismaService.course.findMany({
      where: {
        teacherId: userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        thumbnail: true,
        public: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses;
  }

  async createMyCourse(
    userId: string,
    createCourseDto: CreateCourseDto,
  ): Promise<CreateCourseResDto> {
    const course = await this.prismaService.course.create({
      data: {
        ...createCourseDto,
        thumbnail: `https://${this.configService.get<string>(
          'CLOUDFRONT_DOMAIN',
        )}/${createCourseDto.thumbnail}`,
        teacherId: userId,
      },
    });

    return course;
  }

  async createCourseContent(
    createCourseContentDto: CreateCourseContentDto,
  ): Promise<GetSectionDto[]> {
    const course = await this.prismaService.course.findUnique({
      where: { id: createCourseContentDto.courseId },
    });
    if (!course) {
      throw new BadRequestException('Course not found');
    }

    const createSectionQueries = createCourseContentDto.sections.map(
      (section, sectionIndex) =>
        this.prismaService.section.create({
          data: {
            title: section.title,
            order: sectionIndex + 1,
            courseId: createCourseContentDto.courseId,
            lessons: {
              create: section.lessons.map((lesson, lessonIndex) => ({
                title: lesson.title,
                videoId: lesson.videoId,
                order: lessonIndex + 1,
                questions: {
                  create: lesson.questions?.map((question) => ({
                    question: question.content,
                    explain: question.explain,
                    answers: {
                      create: question.answers.map((answer) => ({
                        answer: answer.content,
                        correct: answer.isCorrect,
                      })),
                    },
                  })),
                },
              })),
            },
          },
        }),
    );

    const queries: Prisma.PrismaPromise<any>[] = [...createSectionQueries];
    const hasVideo = createCourseContentDto.sections.some((section) =>
      section.lessons.some((lesson) => !!lesson.videoId),
    );
    if (hasVideo) {
      const totalDuration = createCourseContentDto.sections
        .flatMap((section) => section.lessons)
        .reduce((total, lesson) => total + (lesson.duration || 0), 0);

      queries.push(
        this.prismaService.course.update({
          where: { id: createCourseContentDto.courseId },
          data: { status: 'PENDING', duration: totalDuration },
        }),
      );
    }
    const createSectionResults = await this.prismaService.$transaction(queries);

    return createSectionResults;
  }

  async enrollFreeCourse(userId: string, courseId: string) {
    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    if (course.price > 0) {
      throw new BadRequestException('Course is not free');
    }

    await this.prismaService.$transaction(async (tx) => {
      const enrollment = await tx.courseEnrollment.create({
        data: { courseId, userId },
      });
      const course = await tx.course.update({
        where: { id: courseId },
        data: { numberOfStudents: { increment: 1 } },
      });
      await tx.notification.create({
        data: {
          type: 'NEW_ENROLLMENT',
          fromUserId: userId,
          targetUserId: course.teacherId,
          resourceId: enrollment.id,
        },
      });
    });
  }

  async createVideoPresignedUrl(
    createVideoDto: CreateVideoDto,
  ): Promise<UploadVideoUrlDto> {
    const objectId = uuidv4();
    const key = `videos/raw/${objectId}${path.extname(
      createVideoDto.fileName,
    )}`;
    const expiresIn = 60 * 5;
    const url = await this.storageService.createUploadPresignedUrl(
      key,
      expiresIn,
    );

    const video = await this.prismaService.video.create({
      data: {
        duration: createVideoDto.duration,
        objectKey: objectId,
      },
    });

    return { url, videoId: video.id };
  }

  async createThumbnailPresignedUrl(
    createThumbnailDto: CreateThumbnailDto,
  ): Promise<UploadThumbnailUrlDto> {
    const key = `images/${uuidv4()}${path.extname(
      createThumbnailDto.fileName,
    )}`;
    const expiresIn = 60 * 5; // 5 minutes
    const url = await this.storageService.createUploadPresignedUrl(
      key,
      expiresIn,
    );

    return { key, url };
  }

  async completeConvertVideo(objectId: string) {
    const video = await this.prismaService.video.update({
      where: { objectKey: objectId },
      data: { status: Status.COMPLETED },
      select: {
        lesson: {
          select: {
            section: {
              select: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    teacher: { select: { name: true, email: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    const pendingVideo = await this.prismaService.video.findFirst({
      where: {
        lesson: { section: { courseId: video.lesson?.section.course.id } },
        status: { not: Status.COMPLETED },
      },
    });

    if (!pendingVideo) {
      this.mailService.sendMail({
        to: video.lesson?.section.course.teacher.email,
        subject: 'Complete process course',
        template: 'complete-process-course',
        context: {
          name: video.lesson?.section.course.teacher.name,
          title: video.lesson?.section.course.title,
          url: `${this.configService.get(
            'WEB_APP_URL',
          )}/instructor/courses?courseId=${video.lesson?.section.course.id}`,
        },
      });
      await this.prismaService.course.update({
        where: { id: video.lesson?.section.course.id },
        data: { status: Status.COMPLETED },
      });
    }
  }

  async updateCourseVisibility(
    updateCourseVisibilityDto: UpdateCourseVisibilityDto,
  ) {
    const course = await this.prismaService.course.findUnique({
      where: { id: updateCourseVisibilityDto.courseId },
      select: {
        sections: { select: { lessons: { select: { videoId: true } } } },
        numberOfStudents: true,
      },
    });
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    if (course.numberOfStudents > 0) {
      throw new BadRequestException('Course has students');
    }

    await this.prismaService.course.update({
      where: { id: updateCourseVisibilityDto.courseId },
      data: { public: updateCourseVisibilityDto.isVisible },
    });

    const videoIds = course.sections
      .flatMap((section) => section.lessons.map((lesson) => lesson.videoId))
      .filter((videoId) => !!videoId);
    const videos = await this.prismaService.video.findMany({
      where: { id: { in: videoIds as string[] } },
    });
    const notDoneProcessVideo = videos.some(
      (video) => video.status !== Status.COMPLETED,
    );
    if (notDoneProcessVideo) {
      throw new ServiceUnavailableException();
    }
  }
}
