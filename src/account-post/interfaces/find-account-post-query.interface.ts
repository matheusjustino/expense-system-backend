import { AccountPostFrequency } from '@prisma/client';

export interface FindAccountPostQuery {
	month: number;
	year: number;
	frequency?: AccountPostFrequency;
}
