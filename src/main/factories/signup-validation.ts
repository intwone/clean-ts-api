import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationProtocol } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: ValidationProtocol[] = [];
  ['name', 'email', 'password', 'passwordConfirmation'].forEach(field =>
    validations.push(new RequiredFieldValidation(field)),
  );
  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
};
