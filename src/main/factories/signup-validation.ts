import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation';
import { EmailValidation } from '../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationProtocol } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: ValidationProtocol[] = [];
  ['name', 'email', 'password', 'passwordConfirmation'].forEach(field =>
    validations.push(new RequiredFieldValidation(field)),
  );
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
  const validationComposite = new ValidationComposite(validations);
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return validationComposite;
};
