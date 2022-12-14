import { InvalidParamError } from '@/presentation/errors';
import { EmailValidatorProtocol } from '@/validation/protocols/email-validator';
import { mockEmailValidator } from '@/validation/test';
import { EmailValidation } from './email-validation';

interface SutProtocol {
  sut: EmailValidation;
  emailValidatorStub: EmailValidatorProtocol;
}

const makeSut = (): SutProtocol => {
  const emailValidatorStub = mockEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe('Email Validation', () => {
  it('should an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const error = sut.validate({ email: 'any_email@mail.com' });

    expect(error).toEqual(new InvalidParamError('email'));
  });

  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidEmailSpy = jest.spyOn(emailValidatorStub, 'isValid');
    sut.validate({ email: 'any_email@mail.com' });

    expect(isValidEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw an exception EmailValidator throw an exception', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
