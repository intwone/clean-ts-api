import { SurveyResultModelProtocol } from '@/domain/models/survey-result';
import { SaveSurveyResultParamsProtocol } from '@/domain/usecases/survey-result/save-survey-result';

export interface SaveSurveyResultRepositoryProtocol {
  save: (data: SaveSurveyResultParamsProtocol) => Promise<SurveyResultModelProtocol>;
}
