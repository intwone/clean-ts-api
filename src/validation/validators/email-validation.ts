import { InvalidParamError } from '../../presentation/errors';
import { EmailValidatorProtocol } from '../protocols/email-validator';
import { ValidationProtocol } from '../../presentation/protocols';

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