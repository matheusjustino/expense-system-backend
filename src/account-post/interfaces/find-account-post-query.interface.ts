import { AccountPostType, AccountPostFrequency } from '@prisma/client';

export interface FindAccountPostQuery {
	month: number;
	year: number;
	type?: AccountPostType;
	frequency?: AccountPostFrequency[];
}
