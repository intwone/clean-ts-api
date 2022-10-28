import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

interface SutProtocol {
  sut: AccountMongoRepository;
}

const makeSut = (): SutProtocol => {
  const sut = new AccountMongoRepository();
  return {
    sut,
  };
};

let accountCollection: Collection | undefined;

describe('Account Mongo Repository', () => {
  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection?.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return an account on add success', async () => {
    const { sut } = makeSut();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@mail.com');
    expect(account.password).toBe('any_password');
  });

  it('should return an account on loadByEmail success', async () => {
    await accountCollection?.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    const { sut } = makeSut();
    const account = await sut.loadByEmail('any_email@mail.com');

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@mail.com');
    expect(account.password).toBe('any_password');
  });

  it('should return null if loadByEmail fails', async () => {
    const { sut } = makeSut();
    const account = await sut.loadByEmail('any_email@mail.com');

    expect(account).toBeFalsy();
  });
});
