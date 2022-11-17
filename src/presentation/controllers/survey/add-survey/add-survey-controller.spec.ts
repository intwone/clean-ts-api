import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { AddSurveyController } from './add-survey-controller';
import {
  AddSurveyParamsProtocol,
  AddSurveyProtocol,
  HttpRequestProtocol,
  ValidationProtocol,
} from './add-survey-controller-protocols';

interface SutProtocol {
  sut: AddSurveyController;
  validationStub: ValidationProtocol;
  addSurveyStub: AddSurveyProtocol;
}

const makeFakeRequest = (): HttpRequestProtocol => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  },
});

const makeAddSurvey = (): AddSurveyProtocol => {
  class AddSurveyStub implements AddSurveyProtocol {
    async add(data: AddSurveyParamsProtocol): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  const addSurveyStub = new AddSurveyStub();
  return addSurveyStub;
};

const makeValidation = (): ValidationProtocol => {
  class ValidationStub implements ValidationProtocol {
    validate(input: any): Error | null {
      return null;
    }
  }
  const validationStub = new ValidationStub();
  return validationStub;
};

const makeSut = (): SutProtocol => {
  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return {
    sut,
    validationStub,
    addSurveyStub,
  };
};

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 500 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, 'add');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 500 if addSurvey throw an exception', async () => {
    const { sut, addSurveyStub } = makeSut();
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 204 on sucess', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(noContent());
  });
});
