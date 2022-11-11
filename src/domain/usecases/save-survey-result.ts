import { SurveyResultModelProtocol } from '../models/survey-result';

export type SaveSurveyResultModelProtocol = Omit<SurveyResultModelProtocol, 'id'>;

export interface SaveSurveyResultProtocol {
  save: (data: SaveSurveyResultModelProtocol) => Promise<SurveyResultModelProtocol>;
}
