import {
  AccountModelProtocol,
  AddAccountModelProtocol,
  AddAccountProtocol,
  EncrypterProtocol,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccountProtocol {
  constructor(private readonly encrypter: EncrypterProtocol) {}

  async add(account: AddAccountModelProtocol): Promise<AccountModelProtocol> {
    await this.encrypter.encrypt(account.password);
    return new Promise(resolve =>
      resolve({ email: '', id: '', name: '', password: '' }),
    );
  }
}
