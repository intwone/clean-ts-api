import { InvalidParamError } from '../../errors';
import { ValidationProtocol } from './validation-protocol';

export class CompareFieldsValidation implements ValidationProtocol {
  constructor(private readonly fieldName: string, private readonly fieldNameToCompare: string) {}

  validate(input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare);
    }
    return null;
  }
}
