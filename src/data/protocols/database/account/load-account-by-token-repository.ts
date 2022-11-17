import { AccountModelProtocol } from '@/data/usecases/account/add-account/db-add-account-protocols';

export interface LoadAccountByTokenRepositoryProtocol {
  loadByToken: (token: string, role?: string) => Promise<AccountModelProtocol>;
}
