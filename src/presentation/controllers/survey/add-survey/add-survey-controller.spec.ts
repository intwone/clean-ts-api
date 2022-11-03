import { HttpRequestProtocol } from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import { ValidationProtocol } from '../../../protocols';

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

describe('AddSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    class ValidationStub implements ValidationProtocol {
      validate(input: any): Error | null {
        return null;
      }
    }
    const validationStub = new ValidationStub();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const sut = new AddSurveyController(validationStub);
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
