import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { AUTH_SERVICE } from './interfaces/auth-service.interface';
import { JwtStrategyService } from './jwt-strategy/jwt-strategy.service';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.SECRET,
		}),
	],
	controllers: [AuthController],
	providers: [
		JwtStrategyService,
		{
			useClass: AuthService,
			provide: AUTH_SERVICE,
		},
	],
	exports: [
		JwtStrategyService,
		{
			useClass: AuthService,
			provide: AUTH_SERVICE,
		},
	],
})
export class AuthModule {}
