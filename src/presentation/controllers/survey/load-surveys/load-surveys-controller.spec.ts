import MockDate from 'mockdate';
import { noContent, serverError, success } from '../../../helpers/http/http-helper';
import { LoadSurveysProtocol, SurveyModelProtocol } from './load-survey-controller-protocols';
import { LoadSurveysController } from './load-surveys-controller';

interface SutProtocol {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveysProtocol;
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

const makeLoadSurveys = (): LoadSurveysProtocol => {
  class LoadSurveysStub implements LoadSurveysProtocol {
    async load(): Promise<SurveyModelProtocol[]> {
      const fakeSurvey = makeFakeSurveys();
      return new Promise(resolve => resolve(fakeSurvey));
    }
  }
  const loadSurveysStub = new LoadSurveysStub();
  return loadSurveysStub;
};

const makeSut = (): SutProtocol => {
  const loadSurveysStub = makeLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);
  return {
    sut,
    loadSurveysStub,
  };
};

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load');
    await sut.handle({});

    expect(loadSpy).toHaveBeenCalled();
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();
    const fakeSurveys = makeFakeSurveys();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(success(fakeSurveys));
  });

  it('should return 204 if LoadSurveys return empty', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => resolve([])));
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(noContent());
  });

  it('should return 500 if addSurvey throw an exception', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
