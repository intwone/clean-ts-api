import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/database/mongodb/account-repository/account';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

export const makeSignUpController = (): SignUpController => {
  const salt = 12;
  const encrypter = new BcryptAdapter(salt);
  const addAccountMongoRepository = new AccountMongoRepository();
  const emailValidator = new EmailValidatorAdapter();
  const addAccount = new DbAddAccount(encrypter, addAccountMongoRepository);
  const signUpController = new SignUpController(emailValidator, addAccount);
  return signUpController;
};
