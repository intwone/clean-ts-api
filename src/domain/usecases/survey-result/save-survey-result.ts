import { SurveyResultModelProtocol } from '@/domain/models/survey-result';

export type SaveSurveyResultParamsProtocol = Omit<SurveyResultModelProtocol, 'id'>;

export interface SaveSurveyResultProtocol {
  save: (data: SaveSurveyResultParamsProtocol) => Promise<SurveyResultModelProtocol>;
}
