import { AddAccountRepositoryProtocol } from '../../protocols/add-account-repository';
import {
  AccountModelProtocol,
  AddAccountModelProtocol,
  AddAccountProtocol,
  EncrypterProtocol,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccountProtocol {
  constructor(
    private readonly encrypter: EncrypterProtocol,
    private readonly addAccountRepository: AddAccountRepositoryProtocol,
  ) {}

  async add(
    accountData: AddAccountModelProtocol,
  ): Promise<AccountModelProtocol> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
    return new Promise(resolve =>
      resolve({ email: '', id: '', name: '', password: '' }),
    );
  }
}
