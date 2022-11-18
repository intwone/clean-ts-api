import { ValidationProtocol } from '@/presentation/protocols';

export class ValidationComposite implements ValidationProtocol {
  constructor(private readonly validations: ValidationProtocol[]) {}

  validate(input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input);
      if (error) {
        return error;
      }
    }
    return null as unknown as Error;
  }
}
