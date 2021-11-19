import { Response } from 'express';

export type CustomResponse = Response & {
	body: unknown;
};
