import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './app-config/app-config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AccountPostModule } from './account-post/account-post.module';

@Module({
	imports: [AuthModule, AppConfigModule, PrismaModule, AccountPostModule],
})
export class AppModule {}
