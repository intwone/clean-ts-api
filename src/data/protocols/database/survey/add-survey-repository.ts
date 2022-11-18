import { AddSurveyParamsProtocol } from '@/domain/usecases/survey/add-survey';

export interface AddSurveyRepositoryProtocol {
  add(surveyData: AddSurveyParamsProtocol): Promise<void>;
}
