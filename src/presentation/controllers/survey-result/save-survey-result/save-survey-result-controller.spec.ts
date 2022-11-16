import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  HttpRequestProtocol,
  LoadSurveyByIdProtocol,
  SurveyModelProtocol,
} from './save-survey-result-controller-protocols';

interface SutProtocol {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyByIdProtocol;
}

const makeFakeRequest = (): HttpRequestProtocol => ({
  params: {
    surveyId: 'any_survey_id',
  },
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

const makeSut = (): SutProtocol => {
  const loadSurveyByIdStub = makeLoadMakeSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub);
  return {
    sut,
    loadSurveyByIdStub,
  };
};

describe('SaveSurvey Controller', () => {
  it('should return call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    const fakeRequest = makeFakeRequest();
    sut.handle(fakeRequest);

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
