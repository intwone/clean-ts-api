import { SurveyModelProtocol } from '@/domain/models/survey';

export interface LoadSurveyByIdProtocol {
  loadById: (id: string) => Promise<SurveyModelProtocol>;
}
