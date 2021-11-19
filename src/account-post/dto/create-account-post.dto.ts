import { AccountPostFrequency, AccountPostType } from '.prisma/client';

export class CreateAccountPostDto {
	public description: string;
	public amount: number;
	public type: AccountPostType;
	public frequency: AccountPostFrequency;
	public date: Date;
	public userId: string;
}
