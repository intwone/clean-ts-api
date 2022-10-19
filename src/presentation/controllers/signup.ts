import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { ControllerProtocol } from '../protocols/controller';
import { EmailValidatorProtocol } from '../protocols/email-validator';
import { HttpRequestProtocol, HttpResponseProtocol } from '../protocols/http';

export class SignUpController implements ControllerProtocol {
  constructor(private readonly emailValidator: EmailValidatorProtocol) {}

  handle(httpRequest: HttpRequestProtocol): HttpResponseProtocol {
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
  }
}
