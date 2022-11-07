import { LoadAccountByTokenProtocol } from '../../domain/usecases/load-account-by-token';
import { AccessDeniedError } from '../errors';
import { forbidden, success } from '../helpers/http/http-helper';
import { HttpRequestProtocol, HttpResponseProtocol } from '../protocols';
import { MiddlewareProtocol } from '../protocols/middleware';

export class AuthMiddleware implements MiddlewareProtocol {
  constructor(private readonly loadAccountByToken: LoadAccountByTokenProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    const accessToken = httpRequest.headers?.['x-access-token'];
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken);
      if (account) {
        return success({ accountId: account.id });
      }
    }
    return forbidden(new AccessDeniedError());
  }
}
