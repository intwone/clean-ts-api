import { SurveyModelProtocol } from '@/domain/models/survey';

export interface LoadSurveysRepositoryProtocol {
  loadAll: () => Promise<SurveyModelProtocol[]>;
}
