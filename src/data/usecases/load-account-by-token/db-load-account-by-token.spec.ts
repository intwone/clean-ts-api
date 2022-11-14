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

const makeFakeAccount = (): AccountModelProtocol => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@mail.com',
  password: 'hashed_password',
});

const makeDecrypterStub = (): DecrypterProtocol => {
  class DecrypterStub implements DecrypterProtocol {
    async decrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'));
    }
  }
  const decrypterStub = new DecrypterStub();
  return decrypterStub;
};

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepositoryProtocol => {
  class LoadAccountByTokenRepository implements LoadAccountByTokenRepositoryProtocol {
    async loadByToken(token: string, role?: string): Promise<AccountModelProtocol> {
      const fakeAccount = makeFakeAccount();
      return new Promise(resolve => resolve(fakeAccount));
    }
  }
  const loadAccountByTokenRepositoryStub = new LoadAccountByTokenRepository();
  return loadAccountByTokenRepositoryStub;
};

const makeSut = (): SutProtocol => {
  const decrypterStub = makeDecrypterStub();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
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
    const fakeAccount = makeFakeAccount();
    const account = await sut.load('any_token', 'any_role');

    expect(account).toEqual(fakeAccount);
  });

  it('should throw an exception if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.load('any_token', 'any_role');

    await expect(promise).rejects.toThrow();
  });

  it('should throw an exception if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.load('any_token', 'any_role');

    await expect(promise).rejects.toThrow();
  });
});
