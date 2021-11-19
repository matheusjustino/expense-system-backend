import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

// SERVICES
import { PrismaService } from 'src/prisma/prisma.service';

// ENTITIES
import { User } from '.prisma/client';

// DTO
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// INTERFACES
import { IAuthService } from './interfaces/auth-service.interface';
import { AccountInfo } from './interfaces/account-info.interface';
import { LoginResponse } from './interfaces/login-response.interface';

@Injectable()
export class AuthService implements IAuthService {
	private readonly logger: Logger = new Logger();

	constructor(
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService,
	) {}

	public async register(data: RegisterDto): Promise<User> {
		this.logger.log('Register');

		try {
			const newUser = await this.prismaService.user.create({
				data,
			});

			return newUser;
		} catch (error) {
			if (error.code && error.code === 'P2002') {
				throw new BadRequestException('Email não disponível');
			}

			throw error;
		}
	}

	public async doLogin(data: LoginDto): Promise<LoginResponse> {
		this.logger.log('doLogin');

		const user = await this.prismaService.user.findFirst({
			where: {
				email: data.email,
			},
		});

		if (user) {
			const isPasswordMatch = await this.comparePassword(
				data.password,
				user.password,
			);

			if (isPasswordMatch) {
				const token = this.jwtService.sign({
					id: user.id,
					email: user.email,
					firstName: user.firstName,
				});

				const accountInfo: AccountInfo = {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
				};

				const response: LoginResponse = {
					user: accountInfo,
					token,
				};

				return response;
			}
		}

		throw new BadRequestException('Credenciais Inválidas');
	}

	public async listUsers(): Promise<User[]> {
		const users = await this.prismaService.user.findMany();
		return users;
	}

	public comparePassword(password: string, hash: string): Promise<boolean> {
		this.logger.log('Compare Password');

		return compare(password, hash);
	}
}
