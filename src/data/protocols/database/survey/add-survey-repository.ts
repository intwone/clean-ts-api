import { AddSurveyModelProtocol } from '@/domain/usecases/survey/add-survey';

export interface AddSurveyRepositoryProtocol {
  add(surveyData: AddSurveyModelProtocol): Promise<void>;
}
