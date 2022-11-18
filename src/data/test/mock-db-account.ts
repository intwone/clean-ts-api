import { AddAccountRepositoryProtocol } from '@/data/protocols/database/account/add-account-repository';
import { LoadAccountByEmailRepositoryProtocol } from '@/data/protocols/database/account/load-account-by-email-repository';
import { LoadAccountByTokenRepositoryProtocol } from '@/data/protocols/database/account/load-account-by-token-repository';
import { UpdateAccessTokenRepositoryProtocol } from '@/data/protocols/database/account/update-access-token-repository';
import { AccountModelProtocol } from '@/domain/models/account';
import { mockAddAccountModel } from '@/domain/test';
import { AddAccountParamsProtocol } from '@/domain/usecases/account/add-account';

export const mockAddAccountRepository = (): AddAccountRepositoryProtocol => {
  class AddAccountRepositoryStub implements AddAccountRepositoryProtocol {
    async add(accountData: AddAccountParamsProtocol): Promise<AccountModelProtocol> {
      const fakeAccount = mockAddAccountModel();
      return Promise.resolve(fakeAccount);
    }
  }
  return new AddAccountRepositoryStub();
};

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepositoryProtocol => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepositoryProtocol {
    async loadByEmail(email: string): Promise<AccountModelProtocol> {
      const account = mockAddAccountModel();
      return Promise.resolve(account);
    }
  }
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
  return loadAccountByEmailRepositoryStub;
};

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepositoryProtocol => {
  class LoadAccountByTokenRepository implements LoadAccountByTokenRepositoryProtocol {
    async loadByToken(token: string, role?: string): Promise<AccountModelProtocol> {
      const fakeAccount = mockAddAccountModel();
      return Promise.resolve(fakeAccount);
    }
  }
  const loadAccountByTokenRepositoryStub = new LoadAccountByTokenRepository();
  return loadAccountByTokenRepositoryStub;
};

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepositoryProtocol => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepositoryProtocol {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return Promise.resolve();
    }
  }
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub();
  return updateAccessTokenRepositoryStub;
};
