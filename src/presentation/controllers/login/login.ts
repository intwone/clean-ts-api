import { badRequest, serverError, success, unauthorized } from '../../helpers/http/http-helper';
import {
  AuthenticationProtocol,
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  ValidationProtocol,
} from './login-protocols';

export class LoginController implements ControllerProtocol {
  constructor(
    private readonly authentication: AuthenticationProtocol,
    private readonly validation: ValidationProtocol,
  ) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { email, password } = httpRequest.body;
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
