import { LogMongoRepository } from '../../../../infra/database/mongodb/log/log-mongo-repository';
import { ControllerProtocol } from '../../../../presentation/protocols';
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator';

export const makeLogControllerDecorator = (controller: ControllerProtocol): ControllerProtocol => {
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
};
