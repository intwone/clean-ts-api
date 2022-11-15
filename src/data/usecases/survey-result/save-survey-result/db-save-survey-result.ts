import {
  SaveSurveyResultModelProtocol,
  SaveSurveyResultProtocol,
  SaveSurveyResultRepositoryProtocol,
  SurveyResultModelProtocol,
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResultProtocol {
  constructor(private readonly saveSurveyResultRepository: SaveSurveyResultRepositoryProtocol) {}

  async save(data: SaveSurveyResultModelProtocol): Promise<SurveyResultModelProtocol> {
    const surveyResult = await this.saveSurveyResultRepository.save(data);
    return surveyResult;
  }
}
