import { SurveyModelProtocol } from '../models/survey';

export interface LoadSurveysProtocol {
  load: () => Promise<SurveyModelProtocol[]>;
}
