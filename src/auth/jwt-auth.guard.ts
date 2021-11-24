import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';

// INTERFACES
import {
	AUTH_SERVICE,
	IAuthService,
} from './interfaces/auth-service.interface';
import { UserRequest } from './interfaces/user-request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		@Inject(AUTH_SERVICE)
		private readonly authService: IAuthService,
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();

		if (!req.headers['authorization']) {
			throw new UnauthorizedException('Sem token de autorização');
		}

		const [, token]: string[] = req.headers['authorization'].split(' ');

		const user = await this.authService.validateToken(token);

		if (!user) {
			throw new UnauthorizedException('Falha na autenticação');
		}

		const userRequest: UserRequest = {
			id: user.id,
			email: user.email,
		};

		req.user = userRequest;

		return true;
	}
}
