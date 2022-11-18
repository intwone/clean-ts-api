import { SurveyResultModelProtocol } from '@/domain/models/survey-result';
import { SaveSurveyResultParamsProtocol } from '@/domain/usecases/survey-result/save-survey-result';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParamsProtocol => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date(),
});

export const mockSurveyResultModel = (): SurveyResultModelProtocol => ({
  ...mockSaveSurveyResultParams(),
  id: 'any_id',
});
