import { PrismaClient } from '@prisma/client';
import { SeedData } from './seed-data';

const prisma = new PrismaClient();

const main = async () => {
	const promises = SeedData.map((seed) => {
		return prisma.accountPost.create({
			data: {
				...seed,
				date: new Date(seed.date),
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
	});

	await Promise.all(promises);
};

main().finally(async () => await prisma.$disconnect());
