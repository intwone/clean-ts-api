import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './required-field-validation';

interface SutProtocol {
  sut: RequiredFieldValidation;
}

const makeSut = (): SutProtocol => {
  const sut = new RequiredFieldValidation('any_field');
  return {
    sut,
  };
};

describe('RequiredField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({ wrong_field: 'wrong_field' });

    expect(error).toEqual(new MissingParamError('any_field'));
  });

  it('should not return if validation succeeds', () => {
    const { sut } = makeSut();
    const result = sut.validate({ any_field: 'any_field' });

    expect(result).toBeFalsy();
  });
});
