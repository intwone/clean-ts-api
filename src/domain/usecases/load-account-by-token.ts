import { AccountModelProtocol } from '../models/account';

export interface LoadAccountByTokenProtocol {
  load: (accessToken: string, role?: string) => Promise<AccountModelProtocol>;
}
