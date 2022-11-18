import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test';
import { mockAddAccountModel, throwError } from '@/domain/test';
import { DbLoadAccountByToken } from './db-load-account-by-token';
import {
  AccountModelProtocol,
  DecrypterProtocol,
  LoadAccountByTokenRepositoryProtocol,
} from './db-load-account-by-token-protocols';

interface SutProtocol {
  sut: DbLoadAccountByToken;
  decrypterStub: DecrypterProtocol;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepositoryProtocol;
}

const makeSut = (): SutProtocol => {
  const decrypterStub = mockDecrypter();
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub);
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  };
};

describe('DbLoadAccountByToken Usecase', () => {
  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.load('any_token', 'any_role');

    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve('')));
    const account = await sut.load('any_token');

    expect(account).toBeNull();
  });

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken');
    await sut.load('any_token', 'any_role');

    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  it('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(new Promise(resolve => resolve(null as unknown as AccountModelProtocol)));
    const account = await sut.load('any_token', 'any_role');

    expect(account).toBeNull();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();
    const fakeAccount = mockAddAccountModel();
    const account = await sut.load('any_token', 'any_role');

    expect(account).toEqual(fakeAccount);
  });

  it('should throw an exception if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError);
    const promise = sut.load('any_token', 'any_role');

    await expect(promise).rejects.toThrow();
  });

  it('should throw an exception if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(throwError);
    const promise = sut.load('any_token', 'any_role');

    await expect(promise).rejects.toThrow();
  });
});
