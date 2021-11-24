import './app-config/env.config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { configureAndBuildSwagger } from './app-config/swagger';
import { LoggerMiddleware } from './app-config/middlewares/logger.middleware';
import { CustomValidationPipe } from './app-config/pipes/custom-validation.pipe';
import { HttpExceptionFilter } from './app-config/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
	const logger = new Logger('Bootstrap');
	const PORT = process.env.PORT || 8080;
	const app = await NestFactory.create(AppModule);

	app.enableCors();
	app.use(helmet());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalPipes(new CustomValidationPipe());

	app.use(LoggerMiddleware.intercept);
	app.use(LoggerMiddleware.end);

	configureAndBuildSwagger(app);

	await app.listen(PORT, () => logger.log(`Running on port ${PORT}`));
}
bootstrap();
