import { ControllerProtocol, HttpRequestProtocol, HttpResponseProtocol } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SutProtocol {
  sut: LogControllerDecorator;
  controllerStub: ControllerProtocol;
}

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
  const sut = new LogControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub,
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
});
