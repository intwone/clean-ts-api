import { LoadSurveyByIdRepositoryProtocol } from '@/data/protocols/database/survey/load-survey-by-id-repository';
import { SurveyModelProtocol } from '@/domain/models/survey';
import { LoadSurveyByIdProtocol } from '@/domain/usecases/load-survey-by-id';

export class DbLoadSurveyById implements LoadSurveyByIdProtocol {
  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepositoryProtocol) {}

  async loadById(id: string): Promise<SurveyModelProtocol> {
    await this.loadSurveyByIdRepository.loadById(id);
    return null as unknown as SurveyModelProtocol;
  }
}
