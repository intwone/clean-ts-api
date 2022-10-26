import { MissingParamError } from '../../errors';
import { ValidationProtocol } from './validation';
import { ValidationComposite } from './validation-composite';

interface SutProtocol {
  sut: ValidationComposite;
  validationStub: ValidationProtocol;
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
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);
  return {
    sut,
    validationStub,
  };
};

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
