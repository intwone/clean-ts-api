import { ValidationProtocol } from '../../../../../presentation/protocols/validation';
import { RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators';
import { makeAddSurveyValidation } from './add-survey-validation-factory';

jest.mock('../../../../../validation/validators/validation-composite');

describe('AddSurveyValidation Factory', () => {
  it('should call ValidationComposite with all validations', async () => {
    makeAddSurveyValidation();
    const validations: ValidationProtocol[] = [];
    const requiredFields = ['question', 'answers'];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations);
  });
});
