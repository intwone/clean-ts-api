import { success } from '../../../helpers/http/http-helper';
import {
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  LoadSurveysProtocol,
} from './load-survey-controller-protocols';

export class LoadSurveysController implements ControllerProtocol {
  constructor(private readonly loadSurveys: LoadSurveysProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    const surveys = await this.loadSurveys.load();
    return success(surveys);
  }
}
