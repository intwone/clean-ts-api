import { ValidationProtocol } from '@/presentation/protocols/validation';
import { EmailValidatorProtocol } from '@/validation/protocols/email-validator';
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { makeSignUpValidation } from './signup-validation-factory';

jest.mock('@/validation/validators/validation-composite');

const makeEmailValidator = (): EmailValidatorProtocol => {
  class EmailvalidatorStub implements EmailValidatorProtocol {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailvalidatorStub();
  return emailValidatorStub;
};

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', async () => {
    makeSignUpValidation();
    const validations: ValidationProtocol[] = [];
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations);
  });
});
