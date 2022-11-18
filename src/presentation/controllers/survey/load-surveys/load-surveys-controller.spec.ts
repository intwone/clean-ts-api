import { mockSurveyModels, throwError } from '@/domain/test';
import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import { mockLoadSurveys } from '@/presentation/test';
import MockDate from 'mockdate';
import { LoadSurveysProtocol } from './load-survey-controller-protocols';
import { LoadSurveysController } from './load-surveys-controller';

interface SutProtocol {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveysProtocol;
}

const makeSut = (): SutProtocol => {
  const loadSurveysStub = mockLoadSurveys();
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
    const fakeSurveys = mockSurveyModels();
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
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
