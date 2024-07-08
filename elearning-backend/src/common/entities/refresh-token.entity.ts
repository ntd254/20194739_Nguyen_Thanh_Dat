import { RefreshToken } from '@prisma/client';

export class RefreshTokenEntity implements RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date | null;
}
