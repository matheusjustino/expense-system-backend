import { Module } from '@nestjs/common';
import { AccountPostService } from './account-post.service';
import { AccountPostController } from './account-post.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [AuthModule],
	controllers: [AccountPostController],
	providers: [AccountPostService],
	exports: [AccountPostService],
})
export class AccountPostModule {}
