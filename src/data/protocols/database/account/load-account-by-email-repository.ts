import { AccountModelProtocol } from '@/data/usecases/account/add-account/db-add-account-protocols';

export interface LoadAccountByEmailRepositoryProtocol {
  loadByEmail: (email: string) => Promise<AccountModelProtocol>;
}
