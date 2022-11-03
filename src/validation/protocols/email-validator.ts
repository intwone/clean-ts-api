export interface EmailValidatorProtocol {
  isValid: (email: string) => boolean;
}
