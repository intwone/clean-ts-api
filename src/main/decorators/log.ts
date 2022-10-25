import { LogErrorRepositoryProtocol } from '../../data/protocols/log-error-repository';
import { ControllerProtocol, HttpRequestProtocol, HttpResponseProtocol } from '../../presentation/protocols';

export class LogControllerDecorator implements ControllerProtocol {
  constructor(
    private readonly controller: ControllerProtocol,
    private readonly logErrorRepository: LogErrorRepositoryProtocol,
  ) {}

  async handle(httpRequest: HttpRequestProtocol): Promise<HttpResponseProtocol> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.log(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
