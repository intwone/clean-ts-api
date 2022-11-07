import { LoadAccountByTokenProtocol } from '../../../domain/usecases/load-account-by-token';
import { DecrypterProtocol } from '../../protocols/cryptography/decrypter';
import { LoadAccountByTokenRepositoryProtocol } from '../../protocols/database/account/load-account-by-token-repository';
import { AccountModelProtocol } from '../add-account/db-add-account-protocols';

export class DbLoadAccountByToken implements LoadAccountByTokenProtocol {
  constructor(
    private readonly decrypter: DecrypterProtocol,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepositoryProtocol,
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModelProtocol> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) {
      await this.loadAccountByTokenRepository.loadByToken(token, role);
    }
    return null as unknown as AccountModelProtocol;
  }
}
