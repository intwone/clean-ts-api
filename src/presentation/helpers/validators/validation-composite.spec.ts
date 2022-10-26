import { MissingParamError } from '../../errors';
import { ValidationProtocol } from './validation';
import { ValidationComposite } from './validation-composite';

interface SutProtocol {
  sut: ValidationComposite;
}

const makeValidation = (): ValidationProtocol => {
  class ValidationStub implements ValidationProtocol {
    validate(input: any): Error | null {
      return new MissingParamError('field');
    }
  }
  const validationStub = new ValidationStub();
  return validationStub;
};

const makeSut = (): SutProtocol => {
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);
  return {
    sut,
  };
};

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
