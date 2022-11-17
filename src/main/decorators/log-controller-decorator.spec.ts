import { LogErrorRepositoryProtocol } from '@/data/protocols/database/log/log-error-repository';
import { mockLogErrorRepository } from '@/data/test';
import { mockAddAccountModel } from '@/domain/test';
import { serverError, success } from '@/presentation/helpers/http/http-helper';
import { ControllerProtocol, HttpRequestProtocol, HttpResponseProtocol } from '@/presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator';

interface SutProtocol {
  sut: LogControllerDecorator;
  controllerStub: ControllerProtocol;
  logErrorRepositoryStub: LogErrorRepositoryProtocol;
}

const mockServerError = (): HttpResponseProtocol => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  const error = serverError(fakeError);
  return error;
};

const mockRequest = (): HttpRequestProtocol => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeController = (): ControllerProtocol => {
  class ControllerStub implements ControllerProtocol {
    handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
      const fakeAccount = mockAddAccountModel();
      return new Promise(resolve => resolve(success(fakeAccount)));
    }
  }
  const controllerStub = new ControllerStub();
  return controllerStub;
};

const makeSut = (): SutProtocol => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    const fakeAccount = mockAddAccountModel();

    expect(httpResponse).toEqual(success(fakeAccount));
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const error = mockServerError();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)));
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
