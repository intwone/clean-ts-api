import { mockAddAccountModel } from '@/domain/test';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { AccountMongoRepository } from './account-mongo-repository';

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

  describe('add()', () => {
    it('should return an account on add success', async () => {
      const { sut } = makeSut();
      const fakeAccount = mockAddAccountModel();
      const account = await sut.add(fakeAccount);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });
  });

  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const { sut } = makeSut();
      const fakeAccount = mockAddAccountModel();
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
  });

  describe('updateAccessToken()', () => {
    it('should update the account accessToken on update accessToken success', async () => {
      const { sut } = makeSut();
      const fakeAccount: any = mockAddAccountModel();
      await accountCollection?.insertOne(fakeAccount);
      await sut.updateAccessToken(fakeAccount._id, 'token_updated');
      const resultAccount = await accountCollection?.findOne({ _id: fakeAccount._id });

      expect(resultAccount).toBeTruthy();
      expect(resultAccount?.accessToken).toBe('token_updated');
    });
  });

  describe('loadByToken()', () => {
    it('should return an account on loadByToken success without role', async () => {
      const { sut } = makeSut();
      await accountCollection?.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
      });
      const account = await sut.loadByToken('any_token');

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });

    it('should return an account on loadByToken success with admin role', async () => {
      const { sut } = makeSut();
      await accountCollection?.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin',
      });
      const account = await sut.loadByToken('any_token', 'admin');

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });

    it('should return null on loadByToken with invalid role', async () => {
      const { sut } = makeSut();
      await accountCollection?.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
      });
      const account = await sut.loadByToken('any_token', 'admin');

      expect(account).toBeFalsy();
    });

    it('should return an account on loadByToken if user is admin', async () => {
      const { sut } = makeSut();
      await accountCollection?.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin',
      });
      const account = await sut.loadByToken('any_token');

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });

    it('should return null if loadByToken fails', async () => {
      const { sut } = makeSut();
      const account = await sut.loadByToken('any_token');

      expect(account).toBeFalsy();
    });
  });
});
