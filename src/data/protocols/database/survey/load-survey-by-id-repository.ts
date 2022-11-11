import { SurveyModelProtocol } from '@/domain/models/survey';

export interface LoadSurveyByIdRepositoryProtocol {
  loadById(id: string): Promise<SurveyModelProtocol>;
}
