import { AccountModelProtocol } from '@/domain/models/account';
import { mockAddAccountModel } from '@/domain/test';
import { AddAccountParamsProtocol, AddAccountProtocol } from '@/domain/usecases/account/add-account';
import { AuthenticationParamsProtocol, AuthenticationProtocol } from '@/domain/usecases/account/authentication';
import { LoadAccountByTokenProtocol } from '@/domain/usecases/account/load-account-by-token';

export const mockAddAccount = (): AddAccountProtocol => {
  class AddAccountStub implements AddAccountProtocol {
    async add(account: AddAccountParamsProtocol): Promise<AccountModelProtocol> {
      const fakeAccount = mockAddAccountModel();
      return Promise.resolve(fakeAccount);
    }
  }
  const addAccountStub = new AddAccountStub();
  return addAccountStub;
};

export const mockAuthentication = (): AuthenticationProtocol => {
  class AuthenticationStub implements AuthenticationProtocol {
    async auth(authentication: AuthenticationParamsProtocol): Promise<string> {
      return Promise.resolve('any_token');
    }
  }

  const authenticationStub = new AuthenticationStub();
  return authenticationStub;
};

export const mockLoadAccountByToken = (): LoadAccountByTokenProtocol => {
  class LoadAccountByTokenStub implements LoadAccountByTokenProtocol {
    async load(accessToken: string, role?: string): Promise<AccountModelProtocol> {
      const fakeAccount = mockAddAccountModel();
      return Promise.resolve(fakeAccount);
    }
  }
  const loadAccountByTokenStub = new LoadAccountByTokenStub();
  return loadAccountByTokenStub;
};
