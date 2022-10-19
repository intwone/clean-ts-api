import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { HttpRequestProtocol, HttpResponseProtocol } from '../protocols/http';

export class SignUpController {
  handle(httpRequest: HttpRequestProtocol): HttpResponseProtocol {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    }

    return badRequest(new MissingParamError('email'));
  }
}
