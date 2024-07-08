import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadInterface } from '../../auth/interface/jwt-payload.interface';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class OwnCourseGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<
      Request<{ courseId?: string; lessonId?: string }> & {
        user: JwtPayloadInterface;
      }
    >();

    if (req.params.courseId) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: req.user.userId,
          OR: [
            { courseEnrollments: { some: { courseId: req.params.courseId } } },
            { teachingCourses: { some: { id: req.params.courseId } } },
          ],
        },
      });
      if (!user) {
        throw new BadRequestException('Không sở hữu khóa học');
      }
      return true;
    }
    if (req.params.lessonId) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: req.user.userId,
          OR: [
            {
              courseEnrollments: {
                some: {
                  course: {
                    sections: {
                      some: { lessons: { some: { id: req.params.lessonId } } },
                    },
                  },
                },
              },
            },
            {
              teachingCourses: {
                some: {
                  sections: {
                    some: { lessons: { some: { id: req.params.lessonId } } },
                  },
                },
              },
            },
          ],
        },
      });
      if (!user) {
        throw new BadRequestException('Không sở hữu khóa học');
      }
      return true;
    }

    throw new BadRequestException('Không tìm thấy khóa học');
  }
}
