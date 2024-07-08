import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  email: string;
  avatar: string | null;
  name: string;
  bio: string | null;
  password: string | null;
  verified: boolean;
  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role;
  createdAt: Date;
  updatedAt: Date | null;
}
