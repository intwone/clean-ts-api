import { LogErrorRepositoryProtocol } from '../../data/protocols/log-error-repository';
import { AccountModelProtocol } from '../../domain/models/account';
import { serverError, success } from '../../presentation/helpers/http-helper';
import { ControllerProtocol, HttpRequestProtocol, HttpResponseProtocol } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SutProtocol {
  sut: LogControllerDecorator;
  controllerStub: ControllerProtocol;
  logErrorRepositoryStub: LogErrorRepositoryProtocol;
}

const makeFakeServerError = (): HttpResponseProtocol => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  const error = serverError(fakeError);
  return error;
};

const makeFakeRequest = (): HttpRequestProtocol => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeFakeAccount = (): AccountModelProtocol => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeLogErrorRepository = (): LogErrorRepositoryProtocol => {
  class LogErrorRepositoryStub implements LogErrorRepositoryProtocol {
    async log(stack: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  const logErrorRepositoryStub = new LogErrorRepositoryStub();
  return logErrorRepositoryStub;
};

const makeController = (): ControllerProtocol => {
  class ControllerStub implements ControllerProtocol {
    handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
      const fakeAccount = makeFakeAccount();
      return new Promise(resolve => resolve(success(fakeAccount)));
    }
  }
  const controllerStub = new ControllerStub();
  return controllerStub;
};

const makeSut = (): SutProtocol => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
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
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    const fakeAccount = makeFakeAccount();

    expect(httpResponse).toEqual(success(fakeAccount));
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const error = makeFakeServerError();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)));
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
