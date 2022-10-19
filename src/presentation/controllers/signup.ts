import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import {
  ControllerProtocol,
  EmailValidatorProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
} from '../protocols';

export class SignUpController implements ControllerProtocol {
  constructor(private readonly emailValidator: EmailValidatorProtocol) {}

  handle(httpRequest: HttpRequestProtocol): HttpResponseProtocol {
    try {
      let response!: HttpResponseProtocol;
      const requiredFields = [
        'name',
        'password',
        'passwordConfirmation',
        'email',
      ];
      requiredFields.forEach(field => {
        if (!httpRequest.body[field]) {
          response = badRequest(new MissingParamError(field));
        }
      });
      const { email, password, passwordConfirmation } = httpRequest.body;
      if (response) return response;
      if (password !== passwordConfirmation) {
        response = badRequest(new InvalidParamError('passwordConfirmation'));
        return response;
      }
      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }
      return response;
    } catch (error) {
      return serverError();
    }
  }
}
