import { AuthenticationProtocol } from '../../../domain/usecases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper';
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
      return { statusCode: 200, body: {} };
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
