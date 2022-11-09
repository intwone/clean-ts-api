import { LoginController } from '../../../../../presentation/controllers/login/login/login-controller';
import { ControllerProtocol } from '../../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory';
import { makeDbAuthentication } from '../../../usecases/account/authentication/db-authentication-factory';
import { makeLoginValidation } from './login-validation-factory';

export const makeLoginController = (): ControllerProtocol => {
  const dbAuthentication = makeDbAuthentication();
  const loginValidation = makeLoginValidation();
  const loginController = new LoginController(dbAuthentication, loginValidation);
  return makeLogControllerDecorator(loginController);
};
