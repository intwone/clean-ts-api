import { SurveyResultModelProtocol } from '@/domain/models/survey-result';
import { mockSurveyResultModel } from '@/domain/test';
import {
  SaveSurveyResultParamsProtocol,
  SaveSurveyResultProtocol,
} from '@/domain/usecases/survey-result/save-survey-result';

export const mockSaveSurveyResult = (): SaveSurveyResultProtocol => {
  class SaveSurveyResultStub implements SaveSurveyResultProtocol {
    async save(data: SaveSurveyResultParamsProtocol): Promise<SurveyResultModelProtocol> {
      const fakeSurveyResult = mockSurveyResultModel();
      return new Promise(resolve => resolve(fakeSurveyResult));
    }
  }
  const saveSurveyResultStub = new SaveSurveyResultStub();
  return saveSurveyResultStub;
};
