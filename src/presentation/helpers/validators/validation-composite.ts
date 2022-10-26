import { ValidationProtocol } from './validation';

export class ValidationComposite implements ValidationProtocol {
  constructor(private readonly validations: ValidationProtocol[]) {}

  validate(input: any): Error | null {
    this.validations.forEach(validation => {
      const error = validation.validate(input);
      if (error) {
        return error;
      }
      return null;
    });
    return null;
  }
}
