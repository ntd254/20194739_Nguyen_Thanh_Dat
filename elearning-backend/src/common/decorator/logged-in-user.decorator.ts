import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayloadInterface } from 'src/auth/interface/jwt-payload.interface';

export const LoggedInUser = createParamDecorator(
  (data: keyof JwtPayloadInterface, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();

    return data ? user?.[data] : user;
  },
);
