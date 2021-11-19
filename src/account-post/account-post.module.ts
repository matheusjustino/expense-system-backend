import { Module } from '@nestjs/common';
import { AccountPostService } from './account-post.service';
import { AccountPostController } from './account-post.controller';

@Module({
	controllers: [AccountPostController],
	providers: [AccountPostService],
	exports: [AccountPostService],
})
export class AccountPostModule {}
