import { AccountModelProtocol } from '../models/account';

export interface AddAccountModelProtocol {
  name: string;
  email: string;
  password: string;
}

export interface AddAccountProtocol {
  add: (account: AddAccountModelProtocol) => AccountModelProtocol;
}
