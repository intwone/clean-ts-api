import { AccountModelProtocol } from '../../domain/models/account';
import { LoadAccountByTokenProtocol } from '../../domain/usecases/load-account-by-token';
import { AccessDeniedError } from '../errors';
import { forbidden } from '../helpers/http/http-helper';
import { HttpRequestProtocol } from '../protocols';
import { AuthMiddleware } from './auth-middleware';

interface SutProtocol {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByTokenProtocol;
}

const makeFakeAccount = (): AccountModelProtocol => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@mail.com',
  password: 'hashed_password',
});

const makeLoadAccountByToken = (): LoadAccountByTokenProtocol => {
  class LoadAccountByTokenStub implements LoadAccountByTokenProtocol {
    async load(accessToken: string, role?: string): Promise<AccountModelProtocol> {
      const fakeAccount = makeFakeAccount();
      return new Promise(resolve => resolve(fakeAccount));
    }
  }
  const loadAccountByTokenStub = new LoadAccountByTokenStub();
  return loadAccountByTokenStub;
};

const makeSut = (): SutProtocol => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    const httpRequest: HttpRequestProtocol = {
      headers: {
        'x-access-token': 'any_token',
      },
    };
    await sut.handle(httpRequest);

    expect(loadSpy).toHaveBeenLastCalledWith('any_token');
  });
});
