import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import { ControllerProtocol } from '../protocols/controller';
import { EmailValidatorProtocol } from '../protocols/email-validator';
import { HttpRequestProtocol, HttpResponseProtocol } from '../protocols/http';

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
        if (!httpRequest.body[field])
          response = badRequest(new MissingParamError(field));
      });
      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValidEmail) return badRequest(new InvalidParamError('email'));
      return response;
    } catch (error) {
      return serverError();
    }
  }
}
