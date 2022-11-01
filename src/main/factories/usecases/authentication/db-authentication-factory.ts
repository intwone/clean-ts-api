import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication';
import { AuthenticationProtocol } from '../../../../domain/usecases/authentication';
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypter-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../../infra/database/mongodb/account/account-mongo-repository';
import env from '../../../config/env';

export const makeDbAuthentication = (): AuthenticationProtocol => {
  const salt = 12;
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository);
};
