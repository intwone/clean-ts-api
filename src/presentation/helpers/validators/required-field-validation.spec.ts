import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field');
    const error = sut.validate({ wrong_field: 'wrongField' });

    expect(error).toEqual(new MissingParamError('any_field'));
  });

  it('should not return if validation succeeds', () => {
    const sut = new RequiredFieldValidation('any_field');
    const result = sut.validate({ any_field: 'any_field' });

    expect(result).toBeFalsy();
  });
});
