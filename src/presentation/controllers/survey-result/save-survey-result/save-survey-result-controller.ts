import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper';
import {
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  LoadSurveyByIdProtocol,
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements ControllerProtocol {
  constructor(private readonly loadSurveyById: LoadSurveyByIdProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      return null as unknown as HttpResponseProtocol;
    } catch (error) {
      return serverError(error);
    }
  }
}
