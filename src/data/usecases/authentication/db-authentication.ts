import { AuthenticationModelProtocol, AuthenticationProtocol } from '../../../domain/usecases/authentication';
import { HashComparerProtocol } from '../../protocols/cryptography/hash-comparer';
import { LoadAccountByEmailRepositoryProtocol } from '../../protocols/database/load-account-by-email-repository';

export class DbAuthentication implements AuthenticationProtocol {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoryProtocol,
    private readonly hashComparer: HashComparerProtocol,
  ) {}

  async auth({ email, password }: AuthenticationModelProtocol): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email);
    if (account) {
      await this.hashComparer.compare(password, account.password);
    }
    return null as unknown as string;
  }
}
