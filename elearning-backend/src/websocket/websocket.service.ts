import { Injectable } from '@nestjs/common';
import { CommentEventDto } from './dto/comment-event.dto';
import { PrismaService } from 'src/db/prisma.service';
import { WsException } from '@nestjs/websockets';
import { UserSocket } from './type/socket.type';
import { ReviewEventDto } from './dto/review-event.dto';

@Injectable()
export class WebsocketService {
  constructor(private readonly prismaService: PrismaService) {}

  async handleCommentEvent(client: UserSocket, commentEvent: CommentEventDto) {
    const course = await this.prismaService.course.findUnique({
      where: { id: commentEvent.courseId },
    });
    if (!course) {
      throw new WsException('Course not found');
    }
    client.to(course.teacherId).emit('notification');

    if (commentEvent.parentId) {
      const parentComment = await this.prismaService.comment.findUnique({
        where: { id: commentEvent.parentId },
      });
      if (!parentComment) {
        throw new WsException('Parent comment not found');
      }
      client.to(parentComment.userId).emit('notification');
    }
  }

  async handleReviewEvent(client: UserSocket, reviewEvent: ReviewEventDto) {
    const course = await this.prismaService.course.findUnique({
      where: { id: reviewEvent.courseId },
    });
    if (!course) {
      throw new WsException('Course not found');
    }
    client.to(course.teacherId).emit('notification');
  }
}
