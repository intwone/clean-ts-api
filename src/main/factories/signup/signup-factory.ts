import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypter-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/database/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/database/mongodb/log/log-mongo-repository';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { ControllerProtocol } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): ControllerProtocol => {
  const salt = 12;
  const hasher = new BcryptAdapter(salt);
  const addAccountMongoRepository = new AccountMongoRepository();
  const logMongoRepository = new LogMongoRepository();
  const signUpValidation = makeSignUpValidation();
  const addAccount = new DbAddAccount(hasher, addAccountMongoRepository);
  const signUpController = new SignUpController(addAccount, signUpValidation);
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
