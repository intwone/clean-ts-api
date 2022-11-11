import { AddSurveyModelProtocol } from '@/domain/usecases/add-survey';

export interface AddSurveyRepositoryProtocol {
  add(surveyData: AddSurveyModelProtocol): Promise<void>;
}
