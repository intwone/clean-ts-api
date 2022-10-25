import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { HttpRequestProtocol, HttpResponseProtocol } from '../../protocols';
import { ControllerProtocol } from '../../protocols/controller';
import { EmailValidatorProtocol } from '../signup/signup-protocols';

export class LoginController implements ControllerProtocol {
  constructor(private readonly emailValidator: EmailValidatorProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    if (!httpRequest.body.email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))));
    }
    if (!httpRequest.body.password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))));
    }
    this.emailValidator.isValid(httpRequest.body.email);

    return { statusCode: 200, body: {} };
  }
}
