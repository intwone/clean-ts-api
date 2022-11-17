import { AddSurveyRepositoryProtocol } from '@/data/protocols/database/survey/add-survey-repository';
import { mockAddSurveyRepository } from '@/data/test/mock-db-survey';
import { mockAddSurveyParams, throwError } from '@/domain/test';
import MockDate from 'mockdate';
import { DbAddSurvey } from './db-add-survey';

interface SutProtocol {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepositoryProtocol;
}

const makeSut = (): SutProtocol => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const fakeSurveyData = mockAddSurveyParams();
    await sut.add(fakeSurveyData);

    expect(addSpy).toHaveBeenCalledWith(fakeSurveyData);
  });

  it('should throw an exception if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError);
    const fakeSurveyData = mockAddSurveyParams();
    const promise = sut.add(fakeSurveyData);

    await expect(promise).rejects.toThrow();
  });
});
