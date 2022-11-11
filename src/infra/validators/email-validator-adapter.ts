import { EmailValidatorProtocol } from '@/validation/protocols/email-validator';
import validator from 'validator';

export class EmailValidatorAdapter implements EmailValidatorProtocol {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
