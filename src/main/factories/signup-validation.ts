import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationProtocol } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: ValidationProtocol[] = [];
  ['name', 'email', 'password', 'passwordConfirmation'].forEach(field =>
    validations.push(new RequiredFieldValidation(field)),
  );
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
};
