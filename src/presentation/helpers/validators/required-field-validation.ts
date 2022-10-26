import { MissingParamError } from '../../errors';
import { ValidationProtocol } from '../../protocols/validation-protocol';

export class RequiredFieldValidation implements ValidationProtocol {
  constructor(private readonly fieldName: string) {}

  validate(input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
