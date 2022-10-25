import { ServerError } from '../errors';
import { HttpResponseProtocol } from '../protocols/http';

export const badRequest = (error: Error): HttpResponseProtocol => ({
  statusCode: 400,
  body: error,
});

export const serverError = (error: Error): HttpResponseProtocol => ({
  statusCode: 500,
  body: new ServerError(error.stack as string),
});

export const success = (data: any): HttpResponseProtocol => ({
  statusCode: 200,
  body: data,
});
