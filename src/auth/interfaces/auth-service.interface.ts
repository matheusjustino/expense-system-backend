import { User } from '.prisma/client';

// DTO
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

// INTERFACES
import { LoginResponse } from './login-response.interface';
import { JWTValidatePayload } from '../auth.service';

export const AUTH_SERVICE = 'AUTH SERVICE';

export interface IAuthService {
	register(data: RegisterDto): Promise<User>;
	doLogin(data: LoginDto): Promise<LoginResponse>;
	listUsers(): Promise<User[]>;
	validateToken(token: string): Promise<JWTValidatePayload>;
	comparePassword(password: string, hash: string): Promise<boolean>;
}
