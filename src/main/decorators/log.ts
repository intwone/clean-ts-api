import { ControllerProtocol, HttpRequestProtocol, HttpResponseProtocol } from '../../presentation/protocols';

export class LogControllerDecorator implements ControllerProtocol {
  constructor(private readonly controller: ControllerProtocol) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    await this.controller.handle(httpRequest);
    return { body: '', statusCode: 200 };
  }
}
