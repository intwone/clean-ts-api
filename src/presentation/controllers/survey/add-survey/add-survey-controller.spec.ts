import { HttpRequestProtocol } from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import { ValidationProtocol } from '../../../protocols';
import { badRequest } from '../../../helpers/http/http-helper';

interface SutProtocol {
  sut: AddSurveyController;
  validationStub: ValidationProtocol;
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
  const sut = new AddSurveyController(validationStub);
  return {
    sut,
    validationStub,
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
});
