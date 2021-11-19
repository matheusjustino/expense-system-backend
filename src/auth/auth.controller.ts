import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Inject,
	Post,
	Res,
} from '@nestjs/common';
import { Response } from 'express';

// DTOS
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// INTERFACES
import {
	AUTH_SERVICE,
	IAuthService,
} from './interfaces/auth-service.interface';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(AUTH_SERVICE)
		public readonly authService: IAuthService,
	) {}

	@Post('register')
	public async register(@Body() body: RegisterDto, @Res() res: Response) {
		await this.authService.register(body);
		return res.status(HttpStatus.CREATED).json();
	}

	@Post('login')
	public async doLogin(@Body() body: LoginDto, @Res() res: Response) {
		const user = await this.authService.doLogin(body);
		return res.status(HttpStatus.OK).json(user);
	}

	@Get('users')
	public async listUsers(@Res() res: Response) {
		const users = await this.authService.listUsers();
		return res.status(HttpStatus.OK).json(users);
	}
}
