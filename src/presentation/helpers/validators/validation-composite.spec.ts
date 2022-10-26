import { MissingParamError } from '../../errors';
import { ValidationComposite } from './validation-composite';
import { ValidationProtocol } from './validation-protocol';

interface SutProtocol {
  sut: ValidationComposite;
  validationStubs: ValidationProtocol[];
}

const makeValidation = (): ValidationProtocol => {
  class ValidationStub implements ValidationProtocol {
    validate(input: any): Error | null {
      return null;
    }
  }
  const validationStub = new ValidationStub();
  return validationStub;
};

const makeSut = (): SutProtocol => {
  const validationStubs = [makeValidation(), makeValidation()];
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
