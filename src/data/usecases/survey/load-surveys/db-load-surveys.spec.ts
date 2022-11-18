import { mockLoadSurveysRepository } from '@/data/test/mock-db-survey';
import { mockSurveyModels, throwError } from '@/domain/test';
import MockDate from 'mockdate';
import { DbLoadSurveys } from './db-load-surveys';
import { LoadSurveysRepositoryProtocol } from './db-load-surveys-protocols';

interface SutProtocol {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepositoryProtocol;
}

const makeSut = (): SutProtocol => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return {
    sut,
    loadSurveysRepositoryStub,
  };
};

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    await sut.load();

    expect(loadAllSpy).toHaveBeenCalled();
  });

  it('should return a list of surveys on success', async () => {
    const { sut } = makeSut();
    const fakeSurveys = mockSurveyModels();
    const surveys = await sut.load();

    expect(surveys).toEqual(fakeSurveys);
  });

  it('should throw an exception if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError);
    const promise = sut.load();

    await expect(promise).rejects.toThrow();
  });
});
