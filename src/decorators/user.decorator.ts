import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { UserRequest } from 'src/auth/interfaces/user-request.interface';

export const User = createParamDecorator(
	(data: string, ctx: ExecutionContext): UserRequest => {
		const request = ctx.switchToHttp().getRequest<Request>();
		const { user } = request;
		return user as UserRequest;
	},
);
