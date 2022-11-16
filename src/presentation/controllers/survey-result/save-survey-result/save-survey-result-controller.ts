import {
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  LoadSurveyByIdProtocol,
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements ControllerProtocol {
  constructor(private readonly loadSurveyById: LoadSurveyByIdProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId);
    return null as unknown as HttpResponseProtocol;
  }
}
