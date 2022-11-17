import { AccountModelProtocol } from '@/domain/models/account';
import { AddAccountParamsProtocol } from '@/domain/usecases/account/add-account';
import { AuthenticationParamsProtocol } from '@/domain/usecases/account/authentication';

export const mockAddAccountParams = (): AddAccountParamsProtocol => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const mockAddAccountModel = (): AccountModelProtocol => ({
  ...mockAddAccountParams(),
  id: 'any_id',
});

export const mockAuthenticationParams = (): AuthenticationParamsProtocol => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});
