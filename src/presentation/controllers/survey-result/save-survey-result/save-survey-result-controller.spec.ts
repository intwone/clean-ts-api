import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  HttpRequestProtocol,
  LoadSurveyByIdProtocol,
  SaveSurveyResultModelProtocol,
  SaveSurveyResultProtocol,
  SurveyModelProtocol,
  SurveyResultModelProtocol,
} from './save-survey-result-controller-protocols';

interface SutProtocol {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyByIdProtocol;
  saveSurveyResultStub: SaveSurveyResultProtocol;
}

const makeFakeRequest = (): HttpRequestProtocol => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
  accountId: 'any_account_id',
});

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

const makeFakeSurveyResult = (): SurveyResultModelProtocol => ({
  surveyId: 'valid_survey_id',
  accountId: 'valid_account_id',
  date: new Date(),
  answer: 'valid_answer',
  id: 'valid_id',
});

const makeLoadMakeSurveyById = (): LoadSurveyByIdProtocol => {
  class LoadSurveyByIdStub implements LoadSurveyByIdProtocol {
    async loadById(id: string): Promise<SurveyModelProtocol> {
      const fakeSurvey = makeFakeSurvey();
      return new Promise(resolve => resolve(fakeSurvey));
    }
  }
  const loadSurveyByIdStub = new LoadSurveyByIdStub();
  return loadSurveyByIdStub;
};

const makeSaveSurveyResult = (): SaveSurveyResultProtocol => {
  class SaveSurveyResultStub implements SaveSurveyResultProtocol {
    async save(data: SaveSurveyResultModelProtocol): Promise<SurveyResultModelProtocol> {
      const fakeSurveyResult = makeFakeSurveyResult();
      return new Promise(resolve => resolve(fakeSurveyResult));
    }
  }
  const saveSurveyResultStub = new SaveSurveyResultStub();
  return saveSurveyResultStub;
};

const makeSut = (): SutProtocol => {
  const loadSurveyByIdStub = makeLoadMakeSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
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
    const fakeRequest = makeFakeRequest();
    sut.handle(fakeRequest);

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise(resolve => resolve(null as unknown as SurveyModelProtocol)));
    const fakeRequest = makeFakeRequest();
    const httpRequest = await sut.handle(fakeRequest);

    expect(httpRequest).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return 500 if LoadSurveyById throw an exception', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const fakeRequest = makeFakeRequest();
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
    const fakeRequest = makeFakeRequest();
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
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const fakeRequest = makeFakeRequest();
    const httpResponse = await sut.handle(fakeRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
