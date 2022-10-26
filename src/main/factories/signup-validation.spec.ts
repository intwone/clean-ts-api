import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation';
import { EmailValidation } from '../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationProtocol } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { EmailValidatorProtocol } from '../../presentation/protocols/email-validator';
import { makeSignUpValidation } from './signup-validation';

jest.mock('../../presentation/helpers/validators/validation-composite');

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
    ['name', 'email', 'password', 'passwordConfirmation'].forEach(field =>
      validations.push(new RequiredFieldValidation(field)),
    );
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations);
  });
});
