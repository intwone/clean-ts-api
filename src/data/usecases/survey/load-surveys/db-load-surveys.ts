import { LoadSurveysProtocol, LoadSurveysRepositoryProtocol, SurveyModelProtocol } from './db-load-surveys-protocols';

export class DbLoadSurveys implements LoadSurveysProtocol {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepositoryProtocol) {}

  async load(): Promise<SurveyModelProtocol[]> {
    const surveys = await this.loadSurveysRepository.loadAll();
    return surveys;
  }
}
