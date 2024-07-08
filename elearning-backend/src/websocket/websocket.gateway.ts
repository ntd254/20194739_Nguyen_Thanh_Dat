import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { CommentEventDto } from './dto/comment-event.dto';
import { UserSocket } from './type/socket.type';
import { ReviewEventDto } from './dto/review-event.dto';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { EnrollEventDto } from './dto/enroll-event.dto';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection {
  constructor(private readonly websocketService: WebsocketService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: UserSocket) {
    client.join(client.user.userId);
  }

  @SubscribeMessage('comment')
  createComment(client: UserSocket, commentEvent: CommentEventDto) {
    return this.websocketService.handleCommentEvent(client, commentEvent);
  }

  @SubscribeMessage('review')
  createReview(client: UserSocket, reviewEvent: ReviewEventDto) {
    return this.websocketService.handleReviewEvent(client, reviewEvent);
  }

  @OnEvent('new-enrollment')
  handleOrderCreatedEvent(enrollEvent: EnrollEventDto) {
    this.server.to(enrollEvent.teacherId).emit('notification');
  }
}
