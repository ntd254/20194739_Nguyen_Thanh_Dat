import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { GetUserDto } from './dto/res/get-user.dto';
import { CreateAvatarDto } from './dto/req/create-avatar.dto';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from 'src/storage/storage.service';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { AvatarPresignedUrlDto } from './dto/res/avatar-presigned-url.dto';
import { UpdateProfileDto } from './dto/req/update-profile.dto';
import { UserDetailDto } from './dto/res/user-detail.dto';
import { PaginationQueryDto } from 'src/common/base/pagination-query.dto';
import { PaginationResDto } from 'src/common/base/pagination-res.dto';
import { MyLearningCourseDto } from './dto/res/my-learning-course.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  async getMe(userId: string): Promise<GetUserDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        avatar: true,
        name: true,
        bio: true,
        role: true,
        teachingCourses: {
          select: { id: true },
        },
        courseEnrollments: { select: { courseId: true } },
        userCommentVotes: { select: { commentId: true } },
        reviews: { select: { courseId: true } },
        stripeAccount: { select: { accountId: true, detailsSubmitted: true } },
        links: { select: { id: true, url: true, website: true } },
      },
    });
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    return user;
  }

  async getUserDetail(userId: string): Promise<UserDetailDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        teachingCourses: {
          select: {
            id: true,
            numberOfStudents: true,
            sumRating: true,
            totalRating: true,
          },
          where: { public: true },
        },
        links: { select: { id: true, url: true, website: true } },
      },
    });
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    return user;
  }

  async getMyLearningCourses(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResDto<MyLearningCourseDto>> {
    const [user, total] = await Promise.all([
      this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
          courseEnrollments: {
            skip: (paginationQuery.page - 1) * paginationQuery.limit,
            take: paginationQuery.limit,
            orderBy: { createdAt: 'desc' },
            select: {
              course: {
                select: {
                  id: true,
                  title: true,
                  thumbnail: true,
                  teacher: { select: { id: true, name: true, avatar: true } },
                  reviews: { where: { userId }, select: { rating: true } },
                  sections: {
                    orderBy: { order: 'asc' },
                    select: {
                      lessons: {
                        orderBy: { order: 'asc' },
                        select: {
                          id: true,
                          userLessons: {
                            select: { id: true },
                            where: { userId },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prismaService.course.count({
        where: {
          courseEnrollments: { some: { userId } },
        },
      }),
    ]);
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    return {
      results: user.courseEnrollments.map((enrollment) => enrollment.course),
      total,
      limit: paginationQuery.limit,
      page: paginationQuery.page,
    };
  }

  async createAvatarPresignedUrl(
    createAvatarDto: CreateAvatarDto,
  ): Promise<AvatarPresignedUrlDto> {
    const key = `images/${uuidv4()}${path.extname(createAvatarDto.fileName)}`;
    const expiresIn = 60 * 5; // 5 minutes
    const url = await this.storageService.createUploadPresignedUrl(
      key,
      expiresIn,
    );

    return {
      value: `https://${this.configService.get<string>(
        'CLOUDFRONT_DOMAIN',
      )}/${key}`,
      url,
    };
  }

  async updateMyProfile(updateProfileDto: UpdateProfileDto, userId: string) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        links: {
          // Delete query will execute before create query
          deleteMany: {},
          createMany: { data: updateProfileDto.links || [] },
        },
        name: updateProfileDto.name,
        bio: updateProfileDto.bio,
        avatar: updateProfileDto.avatar,
      },
    });
  }
}
