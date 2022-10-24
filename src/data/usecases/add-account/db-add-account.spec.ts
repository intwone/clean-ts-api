import { DbAddAccount } from './db-add-account';
import {
  AccountModelProtocol,
  AddAccountModelProtocol,
  AddAccountRepositoryProtocol,
  EncrypterProtocol,
} from './db-add-account-protocols';

interface SutProtocol {
  sut: DbAddAccount;
  encrypterStub: EncrypterProtocol;
  addAccountRepositoryStub: AddAccountRepositoryProtocol;
}

const makeEncrypter = () => {
  class EncryperStub implements EncrypterProtocol {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }
  return new EncryperStub();
};

const makeAddAccountRepository = (): AddAccountRepositoryProtocol => {
  class AddAccountRepositoryStub implements AddAccountRepositoryProtocol {
    async add(accountData: AddAccountModelProtocol): Promise<AccountModelProtocol> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid@mail.com',
        password: 'hashed_password',
      };
      return new Promise(resolve => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSut = (): SutProtocol => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
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

  it('should throw an exception if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    };
    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    };
    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'hashed_password',
    });
  });

  it('should throw an exception if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    };
    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    };
    const account = await sut.add(accountData);

    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'hashed_password',
    });
  });
});