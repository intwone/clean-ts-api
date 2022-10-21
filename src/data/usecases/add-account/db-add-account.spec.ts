import { EncrypterProtocol } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface SutProtocol {
  sut: DbAddAccount;
  encrypterStub: EncrypterProtocol;
}

const makeSut = (): SutProtocol => {
  class EncryperStub {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }
  const encrypterStub = new EncryperStub();
  const sut = new DbAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub,
  };
};

describe('DbAddaccount Usecase', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    };
    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
