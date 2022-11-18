import { mockAddAccountRepository, mockHasher, mockLoadAccountByEmailRepository } from '@/data/test';
import { mockAddAccountModel, mockAddAccountParams, throwError } from '@/domain/test';
import { DbAddAccount } from './db-add-account';
import {
  AccountModelProtocol,
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

const makeSut = (): SutProtocol => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  jest
    .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    .mockReturnValue(new Promise(resolve => resolve(null as unknown as AccountModelProtocol)));
  const hasherStub = mockHasher();
  const addAccountRepositoryStub = mockAddAccountRepository();
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
    const accountData = mockAddAccountParams();
    await sut.add(accountData);

    expect(hasherSpy).toHaveBeenCalledWith('any_password');
  });

  it('should throw an exception if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError);
    const accountData = mockAddAccountParams();
    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = mockAddAccountParams();
    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  it('should throw an exception if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError);
    const accountData = mockAddAccountParams();
    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();
    const accountData = mockAddAccountParams();
    const fakeAccount = mockAddAccountModel();
    const account = await sut.add(accountData);

    expect(account).toEqual(fakeAccount);
  });

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    const fakeAccount = mockAddAccountParams();
    await sut.add(fakeAccount);

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should return null if LoadAccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValue(new Promise(resolve => resolve(mockAddAccountModel())));
    const accountData = mockAddAccountParams();
    const account = await sut.add(accountData);

    expect(account).toBeNull();
  });
});
