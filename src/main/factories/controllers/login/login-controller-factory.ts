import { LoginController } from '../../../../presentation/controllers/login/login-controller';
import { ControllerProtocol } from '../../../../presentation/protocols';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '../../usecases/decorators/log-controller-decorator-factory';
import { makeLoginValidation } from './login-validation-factory';

export const makeLoginController = (): ControllerProtocol => {
  const dbAuthentication = makeDbAuthentication();
  const loginValidation = makeLoginValidation();
  const loginController = new LoginController(dbAuthentication, loginValidation);
  return makeLogControllerDecorator(loginController);
};
