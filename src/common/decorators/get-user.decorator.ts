import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@database/entities/user.entity';

export const GetUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);