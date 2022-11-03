import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account';
import { AddAccountProtocol } from '../../../../domain/usecases/add-account';
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypter-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../../infra/database/mongodb/account/account-mongo-repository';

export const makeDbAddAccount = (): AddAccountProtocol => {
  const salt = 12;
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository);
};
