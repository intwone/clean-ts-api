import { InvalidParamError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http/http-helper';
import {
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  LoadSurveyByIdProtocol,
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements ControllerProtocol {
  constructor(private readonly loadSurveyById: LoadSurveyByIdProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId);
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }
    return null as unknown as HttpResponseProtocol;
  }
}
