import { AuthenticationModelProtocol } from '../../../domain/usecases/authentication';
import { HashComparerProtocol } from '../../protocols/cryptography/hash-comparer';
import { LoadAccountByEmailRepositoryProtocol } from '../../protocols/database/load-account-by-email-repository';
import { AccountModelProtocol } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

interface SutProtocol {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryProtocol;
  hashComparerStub: HashComparerProtocol;
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

const makeDbAuthentication = (): LoadAccountByEmailRepositoryProtocol => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepositoryProtocol {
    async load(email: string): Promise<AccountModelProtocol> {
      const account = makeFakeAccount();
      return new Promise(resolve => resolve(account));
    }
  }
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
  return loadAccountByEmailRepositoryStub;
};

const makeSut = (): SutProtocol => {
  const loadAccountByEmailRepositoryStub = makeDbAuthentication();
  const hashComparerStub = makeHashComparer();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub);
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
  };
};

describe('DbAuthentication Usecase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
    const fakeAuthentication = makeFakeAuthentication();
    await sut.auth(fakeAuthentication);

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw an exception if LoadAccountByEmailRepository throw an expection', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const fakeAuthentication = makeFakeAuthentication();
    const promise = sut.auth(fakeAuthentication);

    await expect(promise).rejects.toThrow();
  });

  it('should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)));
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

  it('should throw an exception if hashComparer throw an expection', async () => {
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
});
