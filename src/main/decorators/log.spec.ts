import { ControllerProtocol, HttpRequestProtocol, HttpResponseProtocol } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
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
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const sut = new LogControllerDecorator(controllerStub);
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
});
