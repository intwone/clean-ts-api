import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { HttpRequestProtocol, HttpResponseProtocol } from '../../protocols';
import { ControllerProtocol } from '../../protocols/controller';

export class LoginController implements ControllerProtocol {
  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    if (!httpRequest.body.email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))));
    }
    return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))));
  }
}
