import { Role } from '@prisma/client';

export interface JwtPayloadInterface {
  userId: string;
  role: Role;
}
