import { LogErrorRepositoryProtocol } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/http-helper';
import { ControllerProtocol, HttpRequestProtocol, HttpResponseProtocol } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SutProtocol {
  sut: LogControllerDecorator;
  controllerStub: ControllerProtocol;
  logErrorRepositoryStub: LogErrorRepositoryProtocol;
}

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
      const httpResponse: HttpResponseProtocol = {
        statusCode: 200,
        body: {
          name: 'any_name',
        },
      };
      return new Promise(resolve => resolve(httpResponse));
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
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordconfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordconfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'any_name',
      },
    });
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)));
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordconfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
