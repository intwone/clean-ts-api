import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, success, unauthorized } from '../../helpers/http-helper';
import {
  AuthenticationProtocol,
  ControllerProtocol,
  EmailValidatorProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
} from './login-protocols';

export class LoginController implements ControllerProtocol {
  constructor(
    private readonly emailValidator: EmailValidatorProtocol,
    private readonly authentication: AuthenticationProtocol,
  ) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      let response: HttpResponseProtocol | null = null;
      const { email, password } = httpRequest.body;
      const requiredFields = ['email', 'password'];
      requiredFields.forEach(field => {
        if (!httpRequest.body[field]) {
          response = badRequest(new MissingParamError(field));
        }
      });
      if (response) return response;
      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }
      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }
      return success({ accessToken });
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
