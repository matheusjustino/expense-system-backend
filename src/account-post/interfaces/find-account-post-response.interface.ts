// TYPES
import { AccountPostFrequency, AccountPostType } from '@prisma/client';

export interface FindAccountPostResponse {
	amount: number;
	date: Date;
	frequency: AccountPostFrequency;
	type: AccountPostType;
	description: string;
	id: string;
}
