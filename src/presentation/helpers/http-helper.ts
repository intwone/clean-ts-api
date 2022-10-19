import { ServerError } from '../errors/server-error';
import { HttpResponseProtocol } from '../protocols/http';

export const badRequest = (error: Error): HttpResponseProtocol => ({
  statusCode: 400,
  body: error,
});

export const serverError = (): HttpResponseProtocol => ({
  statusCode: 500,
  body: new ServerError(),
});
