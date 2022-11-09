import { SurveyModelProtocol } from '../../../domain/models/survey';
import { LoadSurveysProtocol } from '../../../domain/usecases/load-surveys';
import { LoadSurveysRepositoryProtocol } from '../../protocols/database/survey/load-survey-repository';

export class DbLoadSurveys implements LoadSurveysProtocol {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepositoryProtocol) {}

  async load(): Promise<SurveyModelProtocol[]> {
    await this.loadSurveysRepository.loadAll();
    return [];
  }
}
