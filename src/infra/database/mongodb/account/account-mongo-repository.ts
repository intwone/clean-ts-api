import { AddAccountRepositoryProtocol } from '../../../../data/protocols/database/account/add-account-repository';
import { LoadAccountByEmailRepositoryProtocol } from '../../../../data/protocols/database/account/load-account-by-email-repository';
import { UpdateAccessTokenRepositoryProtocol } from '../../../../data/protocols/database/account/update-access-token-repository';
import { AccountModelProtocol } from '../../../../domain/models/account';
import { AddAccountModelProtocol } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { map } from './account-mapper';

export class AccountMongoRepository
  implements AddAccountRepositoryProtocol, LoadAccountByEmailRepositoryProtocol, UpdateAccessTokenRepositoryProtocol
{
  async add(accountData: AddAccountModelProtocol): Promise<AccountModelProtocol> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection?.insertOne(accountData);
    return map(accountData) as AccountModelProtocol;
  }

  async loadByEmail(email: string): Promise<AccountModelProtocol> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const account = await accountCollection?.findOne({ email });
    return map(account) as AccountModelProtocol;
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection?.updateOne({ _id: id }, { $set: { accessToken: token } });
  }
}
