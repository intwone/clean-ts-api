import { LogMongoRepository } from '@/infra/database/mongodb/log/log-mongo-repository';
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { ControllerProtocol } from '@/presentation/protocols';

export const makeLogControllerDecorator = (controller: ControllerProtocol): ControllerProtocol => {
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
};
