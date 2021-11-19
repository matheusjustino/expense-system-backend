/* eslint-disable @typescript-eslint/unbound-method */
import { Injectable, Logger } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

// TYPES
import { BuildMessageResponse } from './interfaces/build-message-response';
import { CustomResponse } from './interfaces/custom-response';

@Injectable()
export class LoggerMiddleware {
	public static verifyAndParseBody = (body: unknown): unknown => {
		if (typeof body === 'string') {
			if (body.length > 0) {
				const response = JSON.parse(body);
				return response;
			}
		}

		return body;
	};

	public static buildMessage(
		req: Request,
		res: CustomResponse,
	): BuildMessageResponse {
		const jsonResponse = this.verifyAndParseBody(res.body);
		const body = this.verifyAndParseBody(req.body);

		const response: BuildMessageResponse = {
			name: 'Expense System Backend',
			date: `${DateTime.local()
				.setZone('America/Sao_Paulo')
				.toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS")}Z`,
			uuid: uuidv4(),
			url: req.originalUrl,
			headers: req.headers,
			body: body || undefined,
			query: req.query || undefined,
			params: req.params || undefined,
			response: {
				statusCode: res.statusCode,
				json: jsonResponse || undefined,
			},
		};

		return response;
	}

	public static end(
		req: Request,
		res: CustomResponse,
		next: NextFunction,
	): void {
		const defaultWrite = res.write;
		const defaultEnd = res.end;
		const chunks = [];

		res.write = (...restArgs) => {
			chunks.push(Buffer.from(restArgs[0]));
			return defaultWrite.apply(res, restArgs) as boolean;
		};

		res.end = (...restArgs) => {
			if (restArgs[0]) {
				chunks.push(Buffer.from(restArgs[0]));
			}
			const body = Buffer.concat(chunks).toString('utf8');

			res.body = body;

			defaultEnd.apply(res, restArgs);
		};

		next();
	}

	public static intercept(
		req: Request,
		res: CustomResponse,
		next: NextFunction,
	): void {
		res.on('finish', () => {
			const message = LoggerMiddleware.buildMessage(req, res);

			if (Number(message.response.statusCode) >= 400) {
				Logger.error(JSON.stringify(message), '', 'ErrorInterceptor');
			} else {
				Logger.log(JSON.stringify(message), 'LoggingInterceptor');
			}
		});
		next();
	}
}
