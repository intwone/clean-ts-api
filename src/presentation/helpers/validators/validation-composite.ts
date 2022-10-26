import { ValidationProtocol } from '../../protocols/validation-protocol';

export class ValidationComposite implements ValidationProtocol {
  constructor(private readonly validations: ValidationProtocol[]) {}

  validate(input: any): Error | null {
    for (const validation of this.validations) {
      const error = validation.validate(input);
      if (error) {
        return error;
      }
    }
    return null;
  }
}
