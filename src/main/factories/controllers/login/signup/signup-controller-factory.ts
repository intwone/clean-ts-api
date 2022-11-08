import { SignUpController } from '../../../../../presentation/controllers/login/signup/signup-controller';
import { ControllerProtocol } from '../../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory';
import { makeDbAddAccount } from '../../../usecases/account/add-account/db-add-account-factory';
import { makeDbAuthentication } from '../../../usecases/account/authentication/db-authentication-factory';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): ControllerProtocol => {
  const signUpValidation = makeSignUpValidation();
  const dbAuthentication = makeDbAuthentication();
  const addAccount = makeDbAddAccount();
  const signUpController = new SignUpController(addAccount, signUpValidation, dbAuthentication);
  return makeLogControllerDecorator(signUpController);
};
