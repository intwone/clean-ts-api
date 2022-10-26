import { AuthenticationProtocol } from '../../../domain/usecases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { HttpRequestProtocol, HttpResponseProtocol } from '../../protocols';
import { ControllerProtocol } from '../../protocols/controller';
import { EmailValidatorProtocol } from '../signup/signup-protocols';

export class LoginController implements ControllerProtocol {
  constructor(
    private readonly emailValidator: EmailValidatorProtocol,
    private readonly authentication: AuthenticationProtocol,
  ) {}

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
      await this.authentication.auth(email, password);
      return { statusCode: 200, body: {} };
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
