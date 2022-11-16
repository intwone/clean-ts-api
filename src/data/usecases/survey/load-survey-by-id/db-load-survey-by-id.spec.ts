import MockDate from 'mockdate';
import { DbLoadSurveyById } from './db-load-survey-by-id';
import { LoadSurveyByIdRepositoryProtocol, SurveyModelProtocol } from './db-load-survey-by-id-protocols';

interface SutProtocol {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepositoryProtocol;
}

const makeFakeSurvey = (): SurveyModelProtocol => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepositoryProtocol => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepositoryProtocol {
    async loadById(id: string): Promise<SurveyModelProtocol> {
      const fakeSurvey = makeFakeSurvey();
      return new Promise(resolve => resolve(fakeSurvey));
    }
  }
  const loadSurveysRepositoryStub = new LoadSurveyByIdRepositoryStub();
  return loadSurveysRepositoryStub;
};

const makeSut = (): SutProtocol => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub();
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
    const fakeSurvey = makeFakeSurvey();
    const survey = await sut.loadById('any_id');

    expect(survey).toEqual(fakeSurvey);
  });

  it('should throw an exception if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.loadById('any_id');

    await expect(promise).rejects.toThrow();
  });
});