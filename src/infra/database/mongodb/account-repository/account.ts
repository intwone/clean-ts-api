import { AddAccountRepositoryProtocol } from '../../../../data/protocols/add-account-repository';
import { AccountModelProtocol } from '../../../../domain/models/account';
import { AddAccountModelProtocol } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepositoryProtocol {
  async add(accountData: AddAccountModelProtocol): Promise<AccountModelProtocol> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection?.insertOne(accountData);
    const id = String(result?.insertedId);
    return { ...accountData, id };
  }
}
