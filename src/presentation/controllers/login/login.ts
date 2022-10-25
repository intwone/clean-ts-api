import { InvalidParamError, MissingParamError } from '../../errors';
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
    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);
    if (!isValidEmail) {
      return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))));
    }
    return { statusCode: 200, body: {} };
  }
}
