import { EmailValidatorProtocol } from '../presentation/protocols/email-validator';

export class EmailValidatorAdapter implements EmailValidatorProtocol {
  isValid(email: string): boolean {
    return false;
  }
}
