import { InvalidParamError } from '../../presentation/errors';
import { CompareFieldsValidation } from './compare-fields-validation';

interface SutProtocol {
  sut: CompareFieldsValidation;
}

const makeSut = (): SutProtocol => {
  const sut = new CompareFieldsValidation('field', 'field_compare');
  return {
    sut,
  };
};

describe('ComparteFields Validation', () => {
  it('should return a InvalidParamError if validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any_value', field_compare: 'other_value' });

    expect(error).toEqual(new InvalidParamError('field_compare'));
  });

  it('should not return if validation succeeds', () => {
    const { sut } = makeSut();
    const result = sut.validate({ field: 'any_value', field_compare: 'any_value' });

    expect(result).toBeFalsy();
  });
});
