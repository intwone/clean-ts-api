import {
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  ValidationProtocol,
} from './add-survey-controller-protocols';

export class AddSurveyController implements ControllerProtocol {
  constructor(private readonly validation: ValidationProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    this.validation.validate(httpRequest.body);
    return new Promise(resolve => resolve(null as unknown as HttpResponseProtocol));
  }
}
