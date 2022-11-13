import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, serverError, success } from '@/presentation/helpers/http/http-helper';
import { MiddlewareProtocol } from '@/presentation/protocols/middleware';
import { HttpRequestProtocol, HttpResponseProtocol, LoadAccountByTokenProtocol } from './auth-middleware-protocols';

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
