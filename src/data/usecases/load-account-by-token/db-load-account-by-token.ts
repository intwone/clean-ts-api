import { LoadAccountByTokenProtocol } from '../../../domain/usecases/load-account-by-token';
import { DecrypterProtocol } from '../../protocols/cryptography/decrypter';
import { AccountModelProtocol } from '../add-account/db-add-account-protocols';

export class DbLoadAccountByToken implements LoadAccountByTokenProtocol {
  constructor(private readonly decrypter: DecrypterProtocol) {}

  async load(accessToken: string, role?: string): Promise<AccountModelProtocol> {
    await this.decrypter.decrypt(accessToken);
    return null as unknown as AccountModelProtocol;
  }
}
