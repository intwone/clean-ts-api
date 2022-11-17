import MockDate from 'mockdate';
import { DbSaveSurveyResult } from './db-save-survey-result';
import {
  SaveSurveyResultParamsProtocol,
  SaveSurveyResultProtocol,
  SaveSurveyResultRepositoryProtocol,
  SurveyResultModelProtocol,
} from './db-save-survey-result-protocols';

interface SutProtocol {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepositoryProtocol;
}

const makeFakeSurveyResultData = (): SaveSurveyResultParamsProtocol => ({
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
    async save(data: SaveSurveyResultParamsProtocol): Promise<SurveyResultModelProtocol> {
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

  it('should throw an exception if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const saveSurveyResultData = makeFakeSurveyResultData();
    const promise = sut.save(saveSurveyResultData);

    await expect(promise).rejects.toThrow();
  });

  it('should return SurveyResult on success', async () => {
    const { sut } = makeSut();
    const fakeSurveyResult = makeFakeSurveyResult();
    const surveyResultData = makeFakeSurveyResultData();
    const saveSurveyResul = await sut.save(surveyResultData);

    expect(saveSurveyResul).toEqual(fakeSurveyResult);
  });
});
