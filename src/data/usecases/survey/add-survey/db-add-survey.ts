import { AddSurveyParamsProtocol, AddSurveyProtocol } from '@/domain/usecases/survey/add-survey';
import { AddSurveyRepositoryProtocol } from './db-add-survey-protocols';

export class DbAddSurvey implements AddSurveyProtocol {
  constructor(private readonly addSurveyRepository: AddSurveyRepositoryProtocol) {}

  async add(data: AddSurveyParamsProtocol): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
