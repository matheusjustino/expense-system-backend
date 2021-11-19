import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// SERVICES
import { PrismaService } from 'src/prisma/prisma.service';

interface JWTValidatePayload {
	id: string;
	email: string;
	firstName: string;
	iat: number;
}

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly prismaService: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.SECRET,
		});
	}

	public async validate(payload: JWTValidatePayload): Promise<any> {
		const user = await this.prismaService.user.findFirst({
			where: { id: payload.id, email: payload.email },
		});

		if (!user) {
			throw new UnauthorizedException('Usuário inválido');
		}

		return payload;
	}
}
