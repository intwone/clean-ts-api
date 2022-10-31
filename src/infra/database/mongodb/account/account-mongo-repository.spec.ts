import { Collection } from 'mongodb';
import { AddAccountModelProtocol } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

interface SutProtocol {
  sut: AccountMongoRepository;
}

const makeFakeAccount = (): AddAccountModelProtocol => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

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
    const fakeAccount = makeFakeAccount();
    const account = await sut.add(fakeAccount);

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@mail.com');
    expect(account.password).toBe('any_password');
  });

  it('should return an account on loadByEmail success', async () => {
    const { sut } = makeSut();
    const fakeAccount = makeFakeAccount();
    await accountCollection?.insertOne(fakeAccount);
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

  it('should update the account accessToken on update accessToken success', async () => {
    const { sut } = makeSut();
    const fakeAccount: any = makeFakeAccount();
    await accountCollection?.insertOne(fakeAccount);
    await sut.updateAccessToken(fakeAccount._id, 'token_updated');
    const resultAccount = await accountCollection?.findOne({ _id: fakeAccount._id });

    expect(resultAccount).toBeTruthy();
    expect(resultAccount?.accessToken).toBe('token_updated');
  });
});
