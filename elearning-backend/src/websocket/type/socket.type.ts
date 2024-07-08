import { Socket } from 'socket.io';
import { JwtPayloadInterface } from 'src/auth/interface/jwt-payload.interface';

export type UserSocket = Socket & { user: JwtPayloadInterface };
