import {
  mockEncrypter,
  mockHashComparer,
  mockLoadAccountByEmailRepository,
  mockUpdateAccessTokenRepository,
} from '@/data/test';
import { mockAuthenticationParams, throwError } from '@/domain/test';
import {
  AccountModelProtocol,
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

const makeSut = (): SutProtocol => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const hashComparerStub = mockHashComparer();
  const encrypterStub = mockEncrypter();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
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
    const fakeAuthentication = mockAuthenticationParams();
    await sut.auth(fakeAuthentication);

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw an exception if LoadAccountByEmailRepository throw an expection', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError);
    const fakeAuthentication = mockAuthenticationParams();
    const promise = sut.auth(fakeAuthentication);

    await expect(promise).rejects.toThrow();
  });

  it('should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(null as unknown as AccountModelProtocol)));
    const fakeAuthentication = mockAuthenticationParams();
    const accessToken = await sut.auth(fakeAuthentication);

    expect(accessToken).toBeNull();
  });

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    const fakeAuthentication = mockAuthenticationParams();
    await sut.auth(fakeAuthentication);

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_password');
  });

  it('should throw an exception if HashComparer throw an expection', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError);
    const fakeAuthentication = mockAuthenticationParams();
    const promise = sut.auth(fakeAuthentication);

    await expect(promise).rejects.toThrow();
  });

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));
    const fakeAuthentication = mockAuthenticationParams();
    const accessToken = await sut.auth(fakeAuthentication);

    expect(accessToken).toBeNull();
  });

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));
    const fakeAuthentication = mockAuthenticationParams();
    const compare = await sut.auth(fakeAuthentication);

    expect(compare).toBeNull();
  });

  it('should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const fakeAuthentication = mockAuthenticationParams();
    await sut.auth(fakeAuthentication);

    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  it('should throw an exception if Encrypter throw an expection', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError);
    const fakeAuthentication = mockAuthenticationParams();
    const promise = sut.auth(fakeAuthentication);

    await expect(promise).rejects.toThrow();
  });

  it('should return access token', async () => {
    const { sut } = makeSut();
    const fakeAuthentication = mockAuthenticationParams();
    const accessToken = await sut.auth(fakeAuthentication);

    expect(accessToken).toBe('any_token');
  });

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');
    const fakeAuthentication = mockAuthenticationParams();
    await sut.auth(fakeAuthentication);

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  it('should throw an exception if UpdateAccessTokenRepository throw an expection', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError);
    const fakeAuthentication = mockAuthenticationParams();
    const promise = sut.auth(fakeAuthentication);

    await expect(promise).rejects.toThrow();
  });
});
