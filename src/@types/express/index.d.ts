import { UserRequest } from 'src/auth/interfaces/user-request.interface';
declare namespace Express {
	export interface Request {
		user: UserRequest;
	}
}
