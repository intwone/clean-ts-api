import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator';

jest.mock('validator', () => ({
  isEmail: (): boolean => {
    return true;
  },
}));

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValidEmail = sut.isValid('invalid_email@mail.com');

    expect(isValidEmail).toBe(false);
  });

  it('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValidEmail = sut.isValid('valid_email@mail.com');

    expect(isValidEmail).toBe(true);
  });
});
