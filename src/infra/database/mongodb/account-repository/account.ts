import { AddAccountRepositoryProtocol } from '../../../../data/protocols/database/add-account-repository';
import { LoadAccountByEmailRepositoryProtocol } from '../../../../data/protocols/database/load-account-by-email-repository';
import { AccountModelProtocol } from '../../../../domain/models/account';
import { AddAccountModelProtocol } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { map } from './account-mapper';

export class AccountMongoRepository implements AddAccountRepositoryProtocol, LoadAccountByEmailRepositoryProtocol {
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
}
