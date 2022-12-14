import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail: (): boolean => {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  return emailValidatorAdapter;
};

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValidEmail = sut.isValid('invalid_email@mail.com');

    expect(isValidEmail).toBe(false);
  });

  it('should return true if validator returns true', () => {
    const sut = makeSut();
    const isValidEmail = sut.isValid('valid_email@mail.com');

    expect(isValidEmail).toBe(true);
  });

  it('should call validator with correct email', () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('any_email@mail.com');

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
