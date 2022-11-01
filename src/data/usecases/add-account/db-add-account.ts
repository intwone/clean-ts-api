import { AddAccountRepositoryProtocol } from '../../protocols/database/account/add-account-repository';
import {
  AccountModelProtocol,
  AddAccountModelProtocol,
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

  async add(accountData: AddAccountModelProtocol): Promise<AccountModelProtocol> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
    const hashedPassword = await this.hasher.hash(accountData.password);
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
    return account;
  }
}
