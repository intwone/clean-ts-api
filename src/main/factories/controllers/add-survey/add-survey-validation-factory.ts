import { ValidationProtocol } from '../../../../presentation/protocols/validation';
import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators';

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: ValidationProtocol[] = [];
  const requiredFields = ['question', 'answers'];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }
  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
};
