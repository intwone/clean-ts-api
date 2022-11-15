import { SurveyModelProtocol } from '@/domain/models/survey';

export interface LoadSurveysProtocol {
  load: () => Promise<SurveyModelProtocol[]>;
}
