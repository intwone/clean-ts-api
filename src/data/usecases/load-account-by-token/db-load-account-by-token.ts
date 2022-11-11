import { DecrypterProtocol } from '@/data/protocols/cryptography/decrypter';
import { LoadAccountByTokenRepositoryProtocol } from '@/data/protocols/database/account/load-account-by-token-repository';
import { LoadAccountByTokenProtocol } from '@/domain/usecases/load-account-by-token';
import { AccountModelProtocol } from '../add-account/db-add-account-protocols';

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
