import { noContent, serverError, success } from '../../../helpers/http/http-helper';
import {
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  LoadSurveysProtocol,
} from './load-survey-controller-protocols';

export class LoadSurveysController implements ControllerProtocol {
  constructor(private readonly loadSurveys: LoadSurveysProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      const surveys = await this.loadSurveys.load();
      return surveys.length ? success(surveys) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
