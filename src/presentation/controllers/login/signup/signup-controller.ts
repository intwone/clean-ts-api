import { EmailInUseError } from '@/presentation/errors';
import { badRequest, forbidden, serverError, success } from '@/presentation/helpers/http/http-helper';
import {
  AddAccountProtocol,
  AuthenticationProtocol,
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  ValidationProtocol,
} from './signup-controller-protocols';

export class SignUpController implements ControllerProtocol {
  constructor(
    private readonly addAccount: AddAccountProtocol,
    private readonly validation: ValidationProtocol,
    private readonly authentication: AuthenticationProtocol,
  ) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { name, email, password } = httpRequest.body;
      const account = await this.addAccount.add({
        name,
        email,
        password,
      });
      if (!account) {
        return forbidden(new EmailInUseError());
      }
      const accessToken = await this.authentication.auth({ email, password });
      return success({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
