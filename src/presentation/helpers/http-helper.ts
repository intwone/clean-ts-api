import { ServerError } from '../errors';
import { HttpResponseProtocol } from '../protocols/http';

export const badRequest = (error: Error): HttpResponseProtocol => ({
  statusCode: 400,
  body: error,
});

export const serverError = (): HttpResponseProtocol => ({
  statusCode: 500,
  body: new ServerError(),
});

export const success = (data: any): HttpResponseProtocol => ({
  statusCode: 200,
  body: data,
});
