import {
  HttpRequestProtocol,
  AddSurveyModelProtocol,
  AddSurveyProtocol,
  ValidationProtocol,
} from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import { badRequest } from '../../../helpers/http/http-helper';

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
  },
});

const makeAddSurvey = (): AddSurveyProtocol => {
  class AddSurveyStub implements AddSurveyProtocol {
    async add(data: AddSurveyModelProtocol): Promise<void> {
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
});
