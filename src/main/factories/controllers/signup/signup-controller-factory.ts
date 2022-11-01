import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller';
import { ControllerProtocol } from '../../../../presentation/protocols';
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '../../usecases/decorators/log-controller-decorator-factory';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): ControllerProtocol => {
  const signUpValidation = makeSignUpValidation();
  const dbAuthentication = makeDbAuthentication();
  const addAccount = makeDbAddAccount();
  const signUpController = new SignUpController(addAccount, signUpValidation, dbAuthentication);
  return makeLogControllerDecorator(signUpController);
};
