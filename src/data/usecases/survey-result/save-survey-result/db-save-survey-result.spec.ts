import { mockSaveSurveyResultRepository } from '@/data/test';
import { mockSaveSurveyResultParams, mockSurveyResultModel, throwError } from '@/domain/test';
import MockDate from 'mockdate';
import { DbSaveSurveyResult } from './db-save-survey-result';
import { SaveSurveyResultRepositoryProtocol } from './db-save-survey-result-protocols';

interface SutProtocol {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepositoryProtocol;
}

const makeSut = (): SutProtocol => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
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
    const saveSurveyResultData = mockSaveSurveyResultParams();
    await sut.save(saveSurveyResultData);

    expect(saverSpy).toHaveBeenCalledWith(saveSurveyResultData);
  });

  it('should throw an exception if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError);
    const saveSurveyResultData = mockSaveSurveyResultParams();
    const promise = sut.save(saveSurveyResultData);

    await expect(promise).rejects.toThrow();
  });

  it('should return SurveyResult on success', async () => {
    const { sut } = makeSut();
    const fakeSurveyResult = mockSurveyResultModel();
    const surveyResultData = mockSaveSurveyResultParams();
    const saveSurveyResul = await sut.save(surveyResultData);

    expect(saveSurveyResul).toEqual(fakeSurveyResult);
  });
});
