import { LoadAccountByTokenProtocol } from '../../domain/usecases/load-account-by-token';
import { AccessDeniedError } from '../errors';
import { forbidden, serverError, success } from '../helpers/http/http-helper';
import { HttpRequestProtocol, HttpResponseProtocol } from '../protocols';
import { MiddlewareProtocol } from '../protocols/middleware';

export class AuthMiddleware implements MiddlewareProtocol {
  constructor(private readonly loadAccountByToken: LoadAccountByTokenProtocol, private readonly role?: string) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'];
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role);
        if (account) {
          return success({ accountId: account.id });
        }
      }
      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}
