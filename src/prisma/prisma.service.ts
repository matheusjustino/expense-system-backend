import {
	INestApplication,
	Injectable,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';

// INTERFACES
import { IPrismaService } from './interfaces/prisma.interface';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy, IPrismaService
{
	constructor() {
		super({
			log: ['info'],
		});
	}

	public async onModuleInit(): Promise<void> {
		await this.$connect();
		this.$use(async (params, next) => {
			if (params.action === 'create' && params.model === 'User') {
				const user = params.args.data as User;
				const salt = genSaltSync(10);
				const hash = hashSync(user.password, salt);

				user.password = hash;
				params.args.data = user;
			}

			return next(params);
		});
	}

	public async onModuleDestroy(): Promise<void> {
		await this.$disconnect();
	}

	public async enableShutdownHooks(app: INestApplication): Promise<void> {
		this.$on('beforeExit', async () => {
			await app.close();
		});
	}
}
