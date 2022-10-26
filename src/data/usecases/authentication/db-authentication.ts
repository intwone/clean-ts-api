import { AuthenticationModelProtocol, AuthenticationProtocol } from '../../../domain/usecases/authentication';
import { LoadAccountByEmailRepositoryProtocol } from '../../protocols/database/load-account-by-email-repository';

export class DbAuthentication implements AuthenticationProtocol {
  constructor(private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoryProtocol) {}

  async auth({ email }: AuthenticationModelProtocol): Promise<string> {
    await this.loadAccountByEmailRepository.load(email);
    return '';
  }
}
