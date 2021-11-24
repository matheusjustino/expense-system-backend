import { Injectable } from '@nestjs/common';

// ENTITIES
import { AccountPost } from '@prisma/client';

// UTILS
import { MonthsValues } from 'src/utils/months.utils';

// SERVICES
import { PrismaService } from '../prisma/prisma.service';

// DTO
import { CreateAccountPostDto } from './dto/create-account-post.dto';

// INTERFACES
import { FindAccountPostQuery } from './interfaces/find-account-post-query.interface';
import { FindAccountPostResponse } from './interfaces/find-account-post-response.interface';

@Injectable()
export class AccountPostService {
	constructor(private readonly prismaService: PrismaService) {}

	public async create(data: CreateAccountPostDto): Promise<
		AccountPost & {
			owner: {
				firstName: string;
				lastName: string;
				email: string;
			};
		}
	> {
		const result = await this.prismaService.accountPost.create({
			data: {
				...data,
				date: new Date(data.date),
			},
			include: {
				owner: {
					select: {
						firstName: true,
						lastName: true,
						email: true,
					},
				},
			},
		});

		return result;
	}

	public async findAll(): Promise<AccountPost[]> {
		return await this.prismaService.accountPost.findMany();
	}

	public async find(
		userId: string,
		query: FindAccountPostQuery,
	): Promise<FindAccountPostResponse[]> {
		const daysInMonth = this.getDaysInMonth(query.year, query.month);

		const result = await this.prismaService.accountPost.findMany({
			where: {
				owner: {
					id: userId,
				},
				date: {
					gte: new Date(`${query.year}-${query.month}-01 00:00`),
					lt: new Date(
						`${query.year}-${query.month}-${daysInMonth} 23:59:59`,
					),
				},
				type: query.type,
				frequency: {
					in: query.frequency,
				},
			},
		});
		return this.mapAccountPostRegister(result);
	}

	public async getDashboard(userId: string, query: FindAccountPostQuery) {
		const daysInMonth = this.getDaysInMonth(query.year, query.month);

		const [monthResult, yearResult] = await Promise.all([
			this.prismaService.accountPost.findMany({
				where: {
					owner: {
						id: userId,
					},
					date: {
						gte: new Date(`${query.year}-${query.month}-01 00:00`),
						lt: new Date(
							`${query.year}-${query.month}-${daysInMonth} 23:59:59`,
						),
					},
					frequency: {
						in: query.frequency,
					},
				},
			}),
			this.prismaService.accountPost.findMany({
				where: {
					owner: {
						id: userId,
					},
					date: {
						gte: new Date(`${query.year}-01-01 00:00`),
						lte: new Date(`${query.year}-12-31 23:59:59`),
					},
				},
			}),
		]);

		const totalGains = monthResult.reduce((prev, curr) => {
			if (curr.type === 'entry') {
				return prev + curr.amount;
			}
			return prev;
		}, 0);

		const totalExpenses = monthResult.reduce((prev, curr) => {
			if (curr.type === 'exit') {
				return prev + curr.amount;
			}
			return prev;
		}, 0);

		const historyData = MonthsValues.map((month) => {
			const amountGains = yearResult.reduce((prev, curr) => {
				if (curr.type === 'entry') {
					const date = new Date(curr.date);
					const monthGain = date.getMonth() + 1;
					// const yearGain = date.getFullYear();

					if (monthGain === month.value) {
						return prev + curr.amount;
					} else {
						return prev;
					}
				} else {
					return prev;
				}
			}, 0);

			const amountExpenses = yearResult.reduce((prev, curr) => {
				if (curr.type === 'exit') {
					const date = new Date(curr.date);
					const monthExpense = date.getMonth() + 1;
					// const yearGain = date.getFullYear();

					if (monthExpense === month.value) {
						return prev + curr.amount;
					} else {
						return prev;
					}
				} else {
					return prev;
				}
			}, 0);

			const response = {
				month: month.label.substr(0, 3),
				gains: amountGains,
				expenses: amountExpenses,
			};

			return response;
		});

		const [
			gainsAmountRecurrent,
			gainsAmountEventual,
			expenseAmountRecurrent,
			expenseAmountEventual,
		] = monthResult.reduce(
			(prev, curr) => {
				if (curr.type === 'entry') {
					if (curr.frequency === 'recurrent') {
						return [
							prev[0] + Number(curr.amount),
							prev[1],
							prev[2],
							prev[3],
						];
					} else {
						return [
							prev[0],
							prev[1] + Number(curr.amount),
							prev[2],
							prev[3],
						];
					}
				} else {
					if (curr.frequency === 'recurrent') {
						return [
							prev[0],
							prev[1],
							prev[2] + Number(curr.amount),
							prev[3],
						];
					} else {
						return [
							prev[0],
							prev[1],
							prev[2],
							prev[3] + Number(curr.amount),
						];
					}
				}
			},
			[0, 0, 0, 0],
		);

		// GAINS RECURRENT EVENTUAL
		const totalGainsRecurrentEventual =
			gainsAmountRecurrent + gainsAmountEventual;
		const gainsRecurrentPercent =
			totalGainsRecurrentEventual > 0
				? Number(
						(
							(gainsAmountRecurrent /
								totalGainsRecurrentEventual) *
							100
						).toFixed(1),
				  )
				: 0;
		const gainsEventualPercent =
			totalGainsRecurrentEventual > 0
				? Number((100 - gainsRecurrentPercent).toFixed(1))
				: 0;

		// EXPENSES RECURRENT EVENTUAL
		const totalExpensesRecurrentEventual =
			expenseAmountRecurrent + expenseAmountEventual;
		const expensesRecurrentPercent =
			totalExpensesRecurrentEventual > 0
				? Number(
						(
							(expenseAmountRecurrent /
								totalExpensesRecurrentEventual) *
							100
						).toFixed(1),
				  )
				: 0;
		const expensesEventualPercent =
			totalGainsRecurrentEventual > 0
				? Number((100 - expensesRecurrentPercent).toFixed(1))
				: 0;

		return {
			totalGains,
			totalExpenses,
			historyData,
			relationGainsRecurrentEventual: {
				name: 'Recorrentes',
				recurrentAmount: gainsAmountRecurrent,
				recurrentPercent: gainsRecurrentPercent,
				eventualAmount: gainsAmountEventual,
				eventualPercent: gainsEventualPercent,
			},
			relationExpensesRecurrentEventual: {
				name: 'Eventuais',
				recurrentAmount: expenseAmountRecurrent,
				recurrentPercent: expensesRecurrentPercent,
				eventualAmount: expenseAmountEventual,
				eventualPercent: expensesEventualPercent,
			},
		};
	}

	private getDaysInMonth(year: number, month: number): number {
		return new Date(year, month, 0).getDate();
	}

	private mapAccountPostRegister(
		accountRegisters: AccountPost[],
	): FindAccountPostResponse[] {
		return accountRegisters.map((accountPost) => {
			const accountPostMapped = {
				amount: accountPost.amount,
				date: accountPost.date,
				frequency: accountPost.frequency,
				description: accountPost.description,
				type: accountPost.type,
				id: accountPost.id,
			};
			return accountPostMapped;
		});
	}
}
