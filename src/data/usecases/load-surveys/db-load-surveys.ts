import { LoadSurveysRepositoryProtocol } from '@/data/protocols/database/survey/load-survey-repository';
import { SurveyModelProtocol } from '@/domain/models/survey';
import { LoadSurveysProtocol } from '@/domain/usecases/load-surveys';

export class DbLoadSurveys implements LoadSurveysProtocol {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepositoryProtocol) {}

  async load(): Promise<SurveyModelProtocol[]> {
    const surveys = await this.loadSurveysRepository.loadAll();
    return surveys;
  }
}
