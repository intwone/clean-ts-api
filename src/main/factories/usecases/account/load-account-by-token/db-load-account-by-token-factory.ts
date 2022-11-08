import { DbLoadAccountByToken } from '../../../../../data/usecases/load-account-by-token/db-load-account-by-token';
import { LoadAccountByTokenProtocol } from '../../../../../domain/usecases/load-account-by-token';
import { JwtAdapter } from '../../../../../infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../../../infra/database/mongodb/account/account-mongo-repository';
import env from '../../../../config/env';

export const makeDbLoadAccountByToken = (): LoadAccountByTokenProtocol => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  const dbLoadAccountByToken = new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
  return dbLoadAccountByToken;
};
