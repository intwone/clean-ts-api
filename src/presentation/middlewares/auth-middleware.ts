import { AccessDeniedError } from '../errors';
import { forbidden } from '../helpers/http/http-helper';
import { HttpRequestProtocol, HttpResponseProtocol } from '../protocols';
import { MiddlewareProtocol } from '../protocols/middleware';

export class AuthMiddleware implements MiddlewareProtocol {
  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    return new Promise(resolve => resolve(forbidden(new AccessDeniedError())));
  }
}
