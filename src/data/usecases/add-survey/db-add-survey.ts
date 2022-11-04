import { AddSurveyModelProtocol, AddSurveyProtocol } from '../../../domain/usecases/add-survey';
import { AddSurveyRepositoryProtocol } from './db-add-survey-protocols';

export class DbAddSurvey implements AddSurveyProtocol {
  constructor(private readonly addSurveyRepository: AddSurveyRepositoryProtocol) {}

  async add(data: AddSurveyModelProtocol): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
