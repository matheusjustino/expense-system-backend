import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const configureAndBuildSwagger = (app: INestApplication) => {
	const config = new DocumentBuilder()
		.setTitle('APP-EXPENSE-SYSTEM')
		.setDescription('API para o sistema Expense System')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('api-doc', app, document);
};
