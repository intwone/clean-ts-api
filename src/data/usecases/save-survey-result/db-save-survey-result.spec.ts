import MockDate from 'mockdate';
import { DbSaveSurveyResult } from './db-save-survey-result';
import {
  SaveSurveyResultModelProtocol,
  SaveSurveyResultProtocol,
  SaveSurveyResultRepositoryProtocol,
  SurveyResultModelProtocol,
} from './db-save-survey-result-protocols';

interface SutProtocol {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepositoryProtocol;
}

const makeFakeSurveyResultData = (): SaveSurveyResultModelProtocol => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModelProtocol => ({
  ...makeFakeSurveyResultData(),
  id: 'any_id',
});

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepositoryProtocol => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultProtocol {
    async save(data: SaveSurveyResultModelProtocol): Promise<SurveyResultModelProtocol> {
      const surveyResult = makeFakeSurveyResult();
      return new Promise(resolve => resolve(surveyResult));
    }
  }
  const saveSurveyResultRepositoryStub = new SaveSurveyResultRepositoryStub();
  return saveSurveyResultRepositoryStub;
};

const makeSut = (): SutProtocol => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return {
    sut,
    saveSurveyResultRepositoryStub,
  };
};

describe('DbSaveSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call SaveSurveyResultRepository with correct password', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saverSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    const saveSurveyResultData = makeFakeSurveyResultData();
    await sut.save(saveSurveyResultData);

    expect(saverSpy).toHaveBeenCalledWith(saveSurveyResultData);
  });
});
