import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper';
import {
  AddSurveyProtocol,
  ControllerProtocol,
  HttpRequestProtocol,
  HttpResponseProtocol,
  ValidationProtocol,
} from './add-survey-controller-protocols';

export class AddSurveyController implements ControllerProtocol {
  constructor(private readonly validation: ValidationProtocol, private readonly addSurvey: AddSurveyProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { question, answers } = httpRequest.body;
      await this.addSurvey.add({
        question,
        answers,
      });
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
