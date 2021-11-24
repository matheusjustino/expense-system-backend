import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Post,
	Query,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserRequest } from 'src/auth/interfaces/user-request.interface';

// GUARDS
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

// SERVICES
import { AccountPostService } from './account-post.service';

// DTO
import { CreateAccountPostDto } from './dto/create-account-post.dto';

// INTERFACES
import { FindAccountPostQuery } from './interfaces/find-account-post-query.interface';

@UseGuards(JwtAuthGuard)
@Controller('account-posts')
export class AccountPostController {
	constructor(private readonly accountPostService: AccountPostService) {}

	@Post()
	public async create(
		@Body() body: CreateAccountPostDto,
		@Res() res: Response,
	) {
		const result = await this.accountPostService.create(body);
		return res.status(HttpStatus.OK).json(result);
	}

	@Get()
	public async find(
		@Query() query: FindAccountPostQuery,
		@Res() res: Response,
		@User() user: UserRequest,
	) {
		const result = await this.accountPostService.find(user.id, query);
		return res.status(HttpStatus.OK).json(result);
	}

	@Get('all')
	public async findAll(@Res() res: Response) {
		const result = await this.accountPostService.findAll();
		return res.status(HttpStatus.OK).json(result);
	}

	@Get('dashboard')
	public async getDashboard(
		@Query() query: FindAccountPostQuery,
		@Res() res: Response,
		@User() user: UserRequest,
	) {
		const result = await this.accountPostService.getDashboard(
			user.id,
			query,
		);
		return res.status(HttpStatus.OK).json(result);
	}
}
