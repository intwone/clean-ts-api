import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationProtocol } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { makeSignUpValidation } from './signup-validation';

jest.mock('../../presentation/helpers/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', async () => {
    makeSignUpValidation();
    const validations: ValidationProtocol[] = [];
    ['name', 'email', 'password', 'passwordConfirmation'].forEach(field =>
      validations.push(new RequiredFieldValidation(field)),
    );
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations);
  });
});
