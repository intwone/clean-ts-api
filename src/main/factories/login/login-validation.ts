import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';
import { ValidationProtocol } from '../../../presentation/protocols/validation';
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
