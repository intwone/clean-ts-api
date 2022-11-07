import { LoadAccountByTokenProtocol } from '../../domain/usecases/load-account-by-token';
import { AccessDeniedError } from '../errors';
import { forbidden } from '../helpers/http/http-helper';
import { HttpRequestProtocol, HttpResponseProtocol } from '../protocols';
import { MiddlewareProtocol } from '../protocols/middleware';

export class AuthMiddleware implements MiddlewareProtocol {
  constructor(private readonly loadAccountByToken: LoadAccountByTokenProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    const accessToken = httpRequest.headers?.['x-access-token'];
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken);
    }
    return forbidden(new AccessDeniedError());
  }
}
