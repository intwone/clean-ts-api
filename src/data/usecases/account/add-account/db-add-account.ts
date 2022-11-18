import { AddAccountRepositoryProtocol } from '@/data/protocols/database/account/add-account-repository';
import {
  AccountModelProtocol,
  AddAccountParamsProtocol,
  AddAccountProtocol,
  HasherProtocol,
  LoadAccountByEmailRepositoryProtocol,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccountProtocol {
  constructor(
    private readonly hasher: HasherProtocol,
    private readonly addAccountRepository: AddAccountRepositoryProtocol,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoryProtocol,
  ) {}

  async add(accountData: AddAccountParamsProtocol): Promise<AccountModelProtocol> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password);
      const newAccount = await this.addAccountRepository.add({
        ...accountData,
        password: hashedPassword,
      });
      return newAccount;
    }
    return null as unknown as AccountModelProtocol;
  }
}
