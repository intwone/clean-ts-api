import { InvalidParamError } from '@/presentation/errors';
import { ValidationProtocol } from '@/presentation/protocols';
import { EmailValidatorProtocol } from '@/validation/protocols/email-validator';

export class EmailValidation implements ValidationProtocol {
  constructor(private readonly fieldName: string, private readonly emailValidator: EmailValidatorProtocol) {}

  validate(input: any): Error | null {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValidEmail) {
      return new InvalidParamError(this.fieldName);
    }
    return null;
  }
}
