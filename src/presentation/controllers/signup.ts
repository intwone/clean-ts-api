import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { HttpRequestProtocol, HttpResponseProtocol } from '../protocols/http';

export class SignUpController {
  handle(httpRequest: HttpRequestProtocol): HttpResponseProtocol {
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
    return response;
  }
}
