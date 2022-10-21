import { AccountModelProtocol } from '../../../domain/models/account';
import {
  AddAccountModelProtocol,
  AddAccountProtocol,
} from '../../../domain/usecases/add-account';
import { EncrypterProtocol } from '../../protocols/encrypter';

export class DbAddAccount implements AddAccountProtocol {
  constructor(private readonly encrypter: EncrypterProtocol) {}

  async add(account: AddAccountModelProtocol): Promise<AccountModelProtocol> {
    await this.encrypter.encrypt(account.password);
    return new Promise(resolve =>
      resolve({ email: '', id: '', name: '', password: '' }),
    );
  }
}
