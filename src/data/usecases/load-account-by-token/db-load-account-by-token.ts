import {
  AccountModelProtocol,
  DecrypterProtocol,
  LoadAccountByTokenProtocol,
  LoadAccountByTokenRepositoryProtocol,
} from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByTokenProtocol {
  constructor(
    private readonly decrypter: DecrypterProtocol,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepositoryProtocol,
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModelProtocol> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role);
      if (account) {
        return account;
      }
    }
    return null as unknown as AccountModelProtocol;
  }
}
