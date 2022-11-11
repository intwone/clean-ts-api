import { SurveyModelProtocol } from '../models/survey';

export interface LoadSurveyByIdProtocol {
  loadById: (id: string) => Promise<SurveyModelProtocol>;
}
