import { SurveyResultModelProtocol } from '@/domain/models/survey-result';
import { SaveSurveyResultModelProtocol } from '@/domain/usecases/survey-result/save-survey-result';

export interface SaveSurveyResultRepositoryProtocol {
  save: (data: SaveSurveyResultModelProtocol) => Promise<SurveyResultModelProtocol>;
}
