import { AddSurveyRepositoryProtocol } from '@/data/protocols/database/survey/add-survey-repository';
import MockDate from 'mockdate';
import { DbAddSurvey } from './db-add-survey';
import { AddSurveyParamsProtocol } from './db-add-survey-protocols';

interface SutProtocol {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepositoryProtocol;
}

const makeFakeSurveyData = (): AddSurveyParamsProtocol => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

const makeAddSurveyRepositoryStub = (): AddSurveyRepositoryProtocol => {
  class AddSurveyRepositoryStub implements AddSurveyRepositoryProtocol {
    async add(surveyData: AddSurveyParamsProtocol): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
  return addSurveyRepositoryStub;
};

const makeSut = (): SutProtocol => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const fakeSurveyData = makeFakeSurveyData();
    await sut.add(fakeSurveyData);

    expect(addSpy).toHaveBeenCalledWith(fakeSurveyData);
  });

  it('should throw an exception if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const fakeSurveyData = makeFakeSurveyData();
    const promise = sut.add(fakeSurveyData);

    await expect(promise).rejects.toThrow();
  });
});
