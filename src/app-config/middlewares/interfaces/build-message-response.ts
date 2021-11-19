import { IncomingHttpHeaders } from 'http';
import { ParsedQs } from 'qs';

export type BuildMessageResponse = {
	name: string;
	date: string;
	uuid: string;
	url: string;
	headers: IncomingHttpHeaders;
	body: unknown;
	query: ParsedQs;
	params: { [key: string]: string };
	response: {
		statusCode: number;
		json: unknown;
	};
};
