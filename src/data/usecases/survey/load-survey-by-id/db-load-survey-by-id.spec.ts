import { mockLoadSurveyByIdRepository } from '@/data/test/mock-db-survey';
import { mockSurveyModel, throwError } from '@/domain/test';
import MockDate from 'mockdate';
import { DbLoadSurveyById } from './db-load-survey-by-id';
import { LoadSurveyByIdRepositoryProtocol } from './db-load-survey-by-id-protocols';

interface SutProtocol {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepositoryProtocol;
}

const makeSut = (): SutProtocol => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return {
    sut,
    loadSurveyByIdRepositoryStub,
  };
};

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.loadById('any_id');

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  it('should return a surveys on success', async () => {
    const { sut } = makeSut();
    const fakeSurvey = mockSurveyModel();
    const survey = await sut.loadById('any_id');

    expect(survey).toEqual(fakeSurvey);
  });

  it('should throw an exception if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError);
    const promise = sut.loadById('any_id');

    await expect(promise).rejects.toThrow();
  });
});
