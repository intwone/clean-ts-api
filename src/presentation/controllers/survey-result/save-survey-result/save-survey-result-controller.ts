import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper';
import {
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  LoadSurveyByIdProtocol,
  SaveSurveyResultProtocol,
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements ControllerProtocol {
  constructor(
    private readonly loadSurveyById: LoadSurveyByIdProtocol,
    private readonly saveSurveyResult: SaveSurveyResultProtocol,
  ) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const { accountId } = httpRequest;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      const answers = survey.answers.map(item => item.answer);
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'));
      }
      await this.saveSurveyResult.save({
        accountId: accountId as string,
        surveyId,
        answer,
        date: new Date(),
      });
      return null as unknown as HttpResponseProtocol;
    } catch (error) {
      return serverError(error);
    }
  }
}
