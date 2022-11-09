import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter';
import { ValidationProtocol } from '../../../../../presentation/protocols/validation';
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators';

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
