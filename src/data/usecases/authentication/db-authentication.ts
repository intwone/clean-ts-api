import { AuthenticationModelProtocol, AuthenticationProtocol } from '../../../domain/usecases/authentication';
import { HashComparerProtocol } from '../../protocols/cryptography/hash-comparer';
import { TokenGeneratorProtocol } from '../../protocols/cryptography/token-generator';
import { LoadAccountByEmailRepositoryProtocol } from '../../protocols/database/load-account-by-email-repository';
import { UpdateAccessTokenRepositoryProtocol } from '../../protocols/database/update-access-token-repository';

export class DbAuthentication implements AuthenticationProtocol {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoryProtocol,
    private readonly hashComparer: HashComparerProtocol,
    private readonly tokenGenerator: TokenGeneratorProtocol,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepositoryProtocol,
  ) {}

  async auth({ email, password }: AuthenticationModelProtocol): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email);
    if (!account) {
      return null as unknown as string;
    }
    const isValidPassword = await this.hashComparer.compare(password, account.password);
    if (!isValidPassword) {
      return null as unknown as string;
    }
    const accessToken = await this.tokenGenerator.generate(account.id);
    await this.updateAccessTokenRepository.update(account.id, accessToken);
    return accessToken;
  }
}
