import { SurveyModelProtocol } from '../../../domain/models/survey';
import { LoadSurveysRepositoryProtocol } from '../../protocols/database/survey/load-survey-repository';
import { DbLoadSurveys } from './db-load-surveys';

interface SutProtocol {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepositoryProtocol;
}

const makeFakeSurveys = (): SurveyModelProtocol[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          image: 'other_image',
          answer: 'other_answer',
        },
      ],
      date: new Date(),
    },
  ];
};

const makeLoadSurveysRepositoryStub = (): LoadSurveysRepositoryProtocol => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepositoryProtocol {
    async loadAll(): Promise<SurveyModelProtocol[]> {
      const fakeSurveys = makeFakeSurveys();
      return new Promise(resolve => resolve(fakeSurveys));
    }
  }
  const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub();
  return loadSurveysRepositoryStub;
};

const makeSut = (): SutProtocol => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return {
    sut,
    loadSurveysRepositoryStub,
  };
};

describe('DbLoadSurveys', () => {
  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    await sut.load();

    expect(loadAllSpy).toHaveBeenCalled();
  });
});
