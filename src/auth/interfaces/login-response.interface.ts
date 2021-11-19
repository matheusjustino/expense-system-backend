import { AccountInfo } from './account-info.interface';

export interface LoginResponse {
	user: AccountInfo;
	token: string;
}
