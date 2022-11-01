import { DbAddAccount } from './db-add-account';
import {
  AccountModelProtocol,
  AddAccountModelProtocol,
  AddAccountRepositoryProtocol,
  HasherProtocol,
  LoadAccountByEmailRepositoryProtocol,
} from './db-add-account-protocols';

interface SutProtocol {
  sut: DbAddAccount;
  hasherStub: HasherProtocol;
  addAccountRepositoryStub: AddAccountRepositoryProtocol;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryProtocol;
}

const makeFakeAccount = (): AccountModelProtocol => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@mail.com',
  password: 'hashed_password',
});

const makeFakeAccountData = (): AddAccountModelProtocol => ({
  name: 'valid_name',
  email: 'valid@mail.com',
  password: 'valid_password',
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepositoryProtocol => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepositoryProtocol {
    async loadByEmail(email: string): Promise<AccountModelProtocol> {
      const account = makeFakeAccount();
      return new Promise(resolve => resolve(account));
    }
  }
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
  return loadAccountByEmailRepositoryStub;
};

const makeHasher = () => {
  class HasherStub implements HasherProtocol {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }
  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepositoryProtocol => {
  class AddAccountRepositoryStub implements AddAccountRepositoryProtocol {
    async add(accountData: AddAccountModelProtocol): Promise<AccountModelProtocol> {
      const fakeAccount = makeFakeAccount();
      return new Promise(resolve => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSut = (): SutProtocol => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub);
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe('DbAddaccount Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, 'hash');
    const accountData = makeFakeAccountData();
    await sut.add(accountData);

    expect(hasherSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw an exception if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const accountData = makeFakeAccountData();
    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = makeFakeAccountData();
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
    const accountData = makeFakeAccountData();
    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();
    const accountData = makeFakeAccountData();
    const fakeAccount = makeFakeAccount();
    const account = await sut.add(accountData);

    expect(account).toEqual(fakeAccount);
  });

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    const fakeAccount = makeFakeAccountData();
    await sut.add(fakeAccount);

    expect(loadSpy).toHaveBeenCalledWith('valid@mail.com');
  });
});
