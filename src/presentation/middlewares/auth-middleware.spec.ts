import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, serverError, success } from '@/presentation/helpers/http/http-helper';
import { mockLoadAccountByToken } from '@/presentation/test';
import { AuthMiddleware } from './auth-middleware';
import { AccountModelProtocol, HttpRequestProtocol, LoadAccountByTokenProtocol } from './auth-middleware-protocols';

interface SutProtocol {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByTokenProtocol;
}

const mockRequest = (): HttpRequestProtocol => ({
  headers: {
    'x-access-token': 'any_token',
  },
});

const makeSut = (role?: string): SutProtocol => {
  const loadAccountByTokenStub = mockLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
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
    const { sut, loadAccountByTokenStub } = makeSut('any_role');
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(loadSpy).toHaveBeenLastCalledWith('any_token', 'any_role');
  });

  it('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockResolvedValueOnce(Promise.resolve(null as unknown as AccountModelProtocol));
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should return 200 if LoadAccountByToken returns account', async () => {
    const { sut } = makeSut();
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(success({ accountId: 'any_id' }));
  });

  it('should return 500 if LoadAccountByToken throw an exception', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(Promise.reject(new Error()));
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
