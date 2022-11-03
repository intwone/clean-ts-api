import { badRequest } from '../../../helpers/http/http-helper';
import {
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  ValidationProtocol,
} from './add-survey-controller-protocols';

export class AddSurveyController implements ControllerProtocol {
  constructor(private readonly validation: ValidationProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    const error = this.validation.validate(httpRequest.body);
    if (error) {
      return badRequest(error);
    }
    return new Promise(resolve => resolve(null as unknown as HttpResponseProtocol));
  }
}
