import { AddAccountRepositoryProtocol } from '../../protocols/database/add-account-repository';
import {
  AccountModelProtocol,
  AddAccountModelProtocol,
  AddAccountProtocol,
  HasherProtocol,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccountProtocol {
  constructor(
    private readonly hasher: HasherProtocol,
    private readonly addAccountRepository: AddAccountRepositoryProtocol,
  ) {}

  async add(accountData: AddAccountModelProtocol): Promise<AccountModelProtocol> {
    const hashedPassword = await this.hasher.hash(accountData.password);
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
    return account;
  }
}
