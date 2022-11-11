import { LoadSurveyByIdRepositoryProtocol } from '@/data/protocols/database/survey/load-survey-by-id-repository';
import { SurveyModelProtocol } from '@/domain/models/survey';
import MockDate from 'mockdate';
import { DbLoadSurveyById } from './db-load-survey-by-id';

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
});
