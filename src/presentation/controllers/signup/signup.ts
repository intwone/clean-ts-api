import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, success } from '../../helpers/http-helper';
import {
  AddAccountProtocol,
  ControllerProtocol,
  EmailValidatorProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  ValidationProtocol,
} from './signup-protocols';

export class SignUpController implements ControllerProtocol {
  constructor(
    private readonly emailValidator: EmailValidatorProtocol,
    private readonly addAccount: AddAccountProtocol,
    private readonly validation: ValidationProtocol,
  ) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      this.validation.validate(httpRequest.body);
      let response: HttpResponseProtocol | null = null;
      const { name, email, password, passwordConfirmation } = httpRequest.body;
      const requiredFields = ['name', 'password', 'passwordConfirmation', 'email'];
      requiredFields.forEach(field => {
        if (!httpRequest.body[field]) {
          response = badRequest(new MissingParamError(field));
        }
      });
      if (response) return response;
      if (password !== passwordConfirmation) {
        response = badRequest(new InvalidParamError('passwordConfirmation'));
        return response;
      }
      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }
      const account = await this.addAccount.add({
        name,
        email,
        password,
      });
      return success(account);
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
