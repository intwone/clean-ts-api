import { AuthenticationModelProtocol } from '../../../domain/usecases/authentication';
import { LoadAccountByEmailRepositoryProtocol } from '../../protocols/load-account-by-email-repository';
import { AccountModelProtocol } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

interface SutProtocol {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryProtocol;
}

const makeFakeAuthentication = (): AuthenticationModelProtocol => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeFakeAccount = (): AccountModelProtocol => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

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
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
  return {
    sut,
    loadAccountByEmailRepositoryStub,
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
});
