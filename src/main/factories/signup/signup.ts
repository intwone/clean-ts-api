import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypter-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/database/mongodb/account-repository/account';
import { LogMongoRepository } from '../../../infra/database/mongodb/log-repository/log';
import { SignUpController } from '../../../presentation/controllers/signup/signup';
import { ControllerProtocol } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log';
import { makeSignUpValidation } from './signup-validation';

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
