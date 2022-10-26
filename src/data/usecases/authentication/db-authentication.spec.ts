import { AuthenticationModelProtocol } from '../../../domain/usecases/authentication';
import { HashComparerProtocol } from '../../protocols/cryptography/hash-comparer';
import { TokenGeneratorProtocol } from '../../protocols/cryptography/token-generator';
import { LoadAccountByEmailRepositoryProtocol } from '../../protocols/database/load-account-by-email-repository';
import { UpdateAccessTokenRepositoryProtocol } from '../../protocols/database/update-access-token-repository';
import { AccountModelProtocol } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

interface SutProtocol {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryProtocol;
  hashComparerStub: HashComparerProtocol;
  tokenGeneratorStub: TokenGeneratorProtocol;
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

const makeTokenGenerator = (): TokenGeneratorProtocol => {
  class TokenGeneratorStub implements TokenGeneratorProtocol {
    async generate(id: string): Promise<string> {
      return 'any_token';
    }
  }
  const tokenGeneratorStub = new TokenGeneratorStub();
  return tokenGeneratorStub;
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

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepositoryProtocol => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepositoryProtocol {
    async update(id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub();
  return updateAccessTokenRepositoryStub;
};

const makeSut = (): SutProtocol => {
  const loadAccountByEmailRepositoryStub = makeDbAuthentication();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
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

  it('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
    const fakeAuthentication = makeFakeAuthentication();
    await sut.auth(fakeAuthentication);

    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });

  it('should throw an exception if TokenGenerator throw an expection', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
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
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update');
    const fakeAuthentication = makeFakeAuthentication();
    await sut.auth(fakeAuthentication);

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });
});
