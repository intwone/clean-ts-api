import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/database/mongodb/account-repository/account';
import { LogMongoRepository } from '../../infra/database/mongodb/log-repository/log';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { ControllerProtocol } from '../../presentation/protocols';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogControllerDecorator } from '../decorators/log';

export const makeSignUpController = (): ControllerProtocol => {
  const salt = 12;
  const encrypter = new BcryptAdapter(salt);
  const addAccountMongoRepository = new AccountMongoRepository();
  const logMongoRepository = new LogMongoRepository();
  const emailValidator = new EmailValidatorAdapter();
  const addAccount = new DbAddAccount(encrypter, addAccountMongoRepository);
  const signUpController = new SignUpController(emailValidator, addAccount);
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
