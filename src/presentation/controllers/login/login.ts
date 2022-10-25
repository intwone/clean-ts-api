import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { HttpRequestProtocol, HttpResponseProtocol } from '../../protocols';
import { ControllerProtocol } from '../../protocols/controller';
import { EmailValidatorProtocol } from '../signup/signup-protocols';

export class LoginController implements ControllerProtocol {
  constructor(private readonly emailValidator: EmailValidatorProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))));
      }
      if (!password) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))));
      }
      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))));
      }
      return { statusCode: 200, body: {} };
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
