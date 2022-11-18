import { mockSurveyResultModel, throwError } from '@/domain/test';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError, success } from '@/presentation/helpers/http/http-helper';
import { mockLoadMakeSurveyById, mockSaveSurveyResult } from '@/presentation/test';
import MockDate from 'mockdate';
import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  HttpRequestProtocol,
  LoadSurveyByIdProtocol,
  SaveSurveyResultProtocol,
  SurveyModelProtocol,
} from './save-survey-result-controller-protocols';

interface SutProtocol {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyByIdProtocol;
  saveSurveyResultStub: SaveSurveyResultProtocol;
}

const mockRequest = (): HttpRequestProtocol => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
  accountId: 'any_account_id',
});

const makeSut = (): SutProtocol => {
  const loadSurveyByIdStub = mockLoadMakeSurveyById();
  const saveSurveyResultStub = mockSaveSurveyResult();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub);
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub,
  };
};

describe('SaveSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should return call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    const fakeRequest = mockRequest();
    sut.handle(fakeRequest);

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise(resolve => resolve(null as unknown as SurveyModelProtocol)));
    const fakeRequest = mockRequest();
    const httpRequest = await sut.handle(fakeRequest);

    expect(httpRequest).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return 500 if LoadSurveyById throw an exception', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError);
    const fakeRequest = mockRequest();
    const httpResponse = await sut.handle(fakeRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut();
    const fakeRequest = {
      params: {
        surveyId: 'any_survey_id',
      },
      body: {
        answer: 'wrong_answer',
      },
    };
    const httpResponse = await sut.handle(fakeRequest);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  it.skip('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');
    const fakeRequest = mockRequest();
    sut.handle(fakeRequest);

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      date: new Date(),
      answer: 'any_answer',
    });
  });

  it('should return 500 if SaveSurveyResult throw an exception', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError);
    const fakeRequest = mockRequest();
    const httpResponse = await sut.handle(fakeRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();
    const fakeRequest = mockRequest();
    const fakeSurveyResult = mockSurveyResultModel();
    const httpResponse = await sut.handle(fakeRequest);

    expect(httpResponse).toEqual(success(fakeSurveyResult));
  });
});
