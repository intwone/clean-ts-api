import { EncrypterProtocol } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface SutProtocol {
  sut: DbAddAccount;
  encrypterStub: EncrypterProtocol;
}

const makeEncrypter = () => {
  class EncryperStub implements EncrypterProtocol {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }

  return new EncryperStub();
};

const makeSut = (): SutProtocol => {
  const encrypterStub = makeEncrypter();
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
