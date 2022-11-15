import {
  LoadSurveyByIdProtocol,
  LoadSurveyByIdRepositoryProtocol,
  SurveyModelProtocol,
} from './db-load-survey-by-id-protocols';

export class DbLoadSurveyById implements LoadSurveyByIdProtocol {
  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepositoryProtocol) {}

  async loadById(id: string): Promise<SurveyModelProtocol> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}
