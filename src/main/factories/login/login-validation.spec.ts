import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';
import { EmailValidatorProtocol } from '../../../presentation/protocols/email-validator';
import { ValidationProtocol } from '../../../presentation/protocols/validation-protocol';
import { makeLoginValidation } from './login-validation';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidatorProtocol => {
  class EmailvalidatorStub implements EmailValidatorProtocol {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailvalidatorStub();
  return emailValidatorStub;
};

describe('LoginValidation Factory', () => {
  it('should call ValidationComposite with all validations', async () => {
    makeLoginValidation();
    const validations: ValidationProtocol[] = [];
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations);
  });
});
