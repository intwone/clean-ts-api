import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { ValidationProtocol } from '../../../presentation/helpers/validators/validation-protocol';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: ValidationProtocol[] = [];
  const requiredFields = ['email', 'password'];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
};
