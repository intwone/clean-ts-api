import { MissingParamError } from '@/presentation/errors';
import { ValidationProtocol } from '@/presentation/protocols';
import { mockValidation } from '@/validation/test';
import { ValidationComposite } from './validation-composite';

interface SutProtocol {
  sut: ValidationComposite;
  validationStubs: ValidationProtocol[];
}

const makeSut = (): SutProtocol => {
  const validationStubs = [mockValidation(), mockValidation()];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs,
  };
};

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return the first error more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new Error());
  });

  it('should not return validation succeeds', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
