import {
  AuthenticationModelProtocol,
  AuthenticationProtocol,
  HashComparerProtocol,
  LoadAccountByEmailRepositoryProtocol,
  TokenGeneratorProtocol,
  UpdateAccessTokenRepositoryProtocol,
} from './db-authentication-protocols';

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
