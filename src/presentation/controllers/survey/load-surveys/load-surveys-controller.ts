import {
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  LoadSurveysProtocol,
} from './load-survey-controller-protocols';

export class LoadSurveysController implements ControllerProtocol {
  constructor(private readonly loadSurveys: LoadSurveysProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    await this.loadSurveys.load();
    return null as unknown as HttpResponseProtocol;
  }
}
