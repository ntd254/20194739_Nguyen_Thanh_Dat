import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { JwtPayloadInterface } from 'src/auth/interface/jwt-payload.interface';

export class WebsocketAdapter extends IoAdapter {
  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options: ServerOptions) {
    const configService = this.app.get(ConfigService);
    const jwtService = this.app.get(JwtService);

    const optionsWithCORS: ServerOptions = {
      ...options,
      path: '/api/socket.io',
      cors: { origin: configService.get<string>('WEB_APP_URL')! },
    };

    const server: Server = super.createIOServer(port, optionsWithCORS);
    server.use(
      async (socket: Socket & { user?: JwtPayloadInterface }, next) => {
        const accessToken = socket.handshake.auth.accessToken;
        if (!accessToken) {
          return next(new Error('Unauthorized'));
        }
        try {
          const user = await jwtService.verifyAsync(accessToken);
          socket.user = user;
          next();
        } catch {
          next(new Error('Unauthorized'));
        }
      },
    );

    return server;
  }
}
