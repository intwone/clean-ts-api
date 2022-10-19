import { HttpResponseProtocol } from '../protocols/http';

export const badRequest = (error: Error): HttpResponseProtocol => ({
  statusCode: 400,
  body: error,
});
