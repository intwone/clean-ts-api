import { AccountModelProtocol } from '@/domain/models/account';

export interface AddAccountParamsProtocol {
  name: string;
  email: string;
  password: string;
}

export interface AddAccountProtocol {
  add: (account: AddAccountParamsProtocol) => Promise<AccountModelProtocol>;
}
