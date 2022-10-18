import { MissingParamError } from '../errors/missing-param-error';
import { HttpRequestProtocol, HttpResponseProtocol } from '../protocols/http';

export class SignUpController {
  handle(httpRequest: HttpRequestProtocol): HttpResponseProtocol {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name'),
      };
    }

    return {
      statusCode: 400,
      body: new MissingParamError('email'),
    };
  }
}
