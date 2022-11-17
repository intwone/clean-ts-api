import { SaveSurveyResultRepositoryProtocol } from '@/data/protocols/database/survey-result/save-survey-result-repository';
import { SurveyResultModelProtocol } from '@/domain/models/survey-result';
import { mockSurveyResultModel } from '@/domain/test';
import {
  SaveSurveyResultParamsProtocol,
  SaveSurveyResultProtocol,
} from '@/domain/usecases/survey-result/save-survey-result';

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepositoryProtocol => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultProtocol {
    async save(data: SaveSurveyResultParamsProtocol): Promise<SurveyResultModelProtocol> {
      const surveyResult = mockSurveyResultModel();
      return new Promise(resolve => resolve(surveyResult));
    }
  }
  const saveSurveyResultRepositoryStub = new SaveSurveyResultRepositoryStub();
  return saveSurveyResultRepositoryStub;
};
