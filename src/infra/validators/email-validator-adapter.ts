import validator from 'validator';
import { EmailValidatorProtocol } from '../../validation/protocols/email-validator';

export class EmailValidatorAdapter implements EmailValidatorProtocol {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
