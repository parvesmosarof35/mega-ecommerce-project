import { Response } from 'express';

type TMeta = {
	limit: number;
	page: number;
	total: number;
	totalPage: number;
};

type TErrorSources = {
	path: string | number;
	message: string;
}[];

type TResponse<T> = {
	statusCode: number;
	success: boolean;
	message?: string;
	meta?: TMeta;
	data: T;
	errorSources?: TErrorSources;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
	res.status(data?.statusCode).json({
		success: data.success,
		message: data.message,
		meta: data.meta,
		data: data.data,
		...(data.errorSources && { errorSources: data.errorSources })
	});
};

export default sendResponse;