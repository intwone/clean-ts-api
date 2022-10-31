import {
  AccountModelProtocol,
  AuthenticationModelProtocol,
  EncrypterProtocol,
  HashComparerProtocol,
  LoadAccountByEmailRepositoryProtocol,
  UpdateAccessTokenRepositoryProtocol,
} from './db-authentication-protocols';

import { DbAuthentication } from './db-authentication';

interface SutProtocol {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryProtocol;
  hashComparerStub: HashComparerProtocol;
  encrypterStub: EncrypterProtocol;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepositoryProtocol;
}

const makeFakeAuthentication = (): AuthenticationModelProtocol => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeFakeAccount = (): AccountModelProtocol => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
});

const makeHashComparer = (): HashComparerProtocol => {
  class HashComparerStub implements HashComparerProtocol {
    async compare(value: string, hash: string): Promise<boolean> {
      return true;
    }
  }
  const hashComparerStub = new HashComparerStub();
  return hashComparerStub;
};

const makeEncrypter = (): EncrypterProtocol => {
  class EncrypterStub implements EncrypterProtocol {
    async encrypt(value: string): Promise<string> {
      return 'any_token';
    }
  }
  const encrypterStub = new EncrypterStub();
  return encrypterStub;
};

const makeDbAuthentication = (): LoadAccountByEmailRepositoryProtocol => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepositoryProtocol {
    async loadByEmail(email: string): Promise<AccountModelProtocol> {
      const account = makeFakeAccount();
      return new Promise(resolve => resolve(account));
    }
  }
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
  return loadAccountByEmailRepositoryStub;
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepositoryProtocol => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepositoryProtocol {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub();
  return updateAccessTokenRepositoryStub;
};

const makeSut = (): SutProtocol => {
  const loadAccountByEmailRepositoryStub = makeDbAuthentication();
  const hashComparerStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication Usecase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    const fakeAuthentication = makeFakeAuthentication();
    await sut.auth(fakeAuthentication);

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw an exception if LoadAccountByEmailRepository throw an expection', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const fakeAuthentication = makeFakeAuthentication();
    const promise = sut.auth(fakeAuthentication);

    await expect(promise).rejects.toThrow();
  });

  it('should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(null as unknown as AccountModelProtocol)));
    const fakeAuthentication = makeFakeAuthentication();
    const accessToken = await sut.auth(fakeAuthentication);

    expect(accessToken).toBeNull();
  });

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    const fakeAuthentication = makeFakeAuthentication();
    await sut.auth(fakeAuthentication);

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  it('should throw an exception if HashComparer throw an expection', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const fakeAuthentication = makeFakeAuthentication();
    const promise = sut.auth(fakeAuthentication);

    await expect(promise).rejects.toThrow();
  });

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));
    const fakeAuthentication = makeFakeAuthentication();
    const accessToken = await sut.auth(fakeAuthentication);

    expect(accessToken).toBeNull();
  });

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));
    const fakeAuthentication = makeFakeAuthentication();
    const compare = await sut.auth(fakeAuthentication);

    expect(compare).toBeNull();
  });

  it('should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const fakeAuthentication = makeFakeAuthentication();
    await sut.auth(fakeAuthentication);

    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  it('should throw an exception if Encrypter throw an expection', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const fakeAuthentication = makeFakeAuthentication();
    const promise = sut.auth(fakeAuthentication);

    await expect(promise).rejects.toThrow();
  });

  it('should return access token', async () => {
    const { sut } = makeSut();
    const fakeAuthentication = makeFakeAuthentication();
    const accessToken = await sut.auth(fakeAuthentication);

    expect(accessToken).toBe('any_token');
  });

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');
    const fakeAuthentication = makeFakeAuthentication();
    await sut.auth(fakeAuthentication);

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  it('should throw an exception if UpdateAccessTokenRepository throw an expection', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const fakeAuthentication = makeFakeAuthentication();
    const promise = sut.auth(fakeAuthentication);

    await expect(promise).rejects.toThrow();
  });
});
